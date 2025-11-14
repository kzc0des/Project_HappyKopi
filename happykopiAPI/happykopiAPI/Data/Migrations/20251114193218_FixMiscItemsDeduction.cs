using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace happykopiAPI.Data.Migrations
{
    public partial class FixMiscItemsDeduction : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Drop the old stored procedure
            migrationBuilder.Sql(@"
                IF OBJECT_ID('dbo.sp_InsertOrder', 'P') IS NOT NULL
                    DROP PROCEDURE dbo.sp_InsertOrder;
            ");

            // Create the updated stored procedure
            migrationBuilder.Sql(@"
CREATE PROCEDURE [dbo].[sp_InsertOrder]
    @UserId INT,
    @OrderDate DATETIME2,
    @TotalAmount DECIMAL(18,2),
    @Status NVARCHAR(50),
    @PaymentType NVARCHAR(50),
    @AmountPaid DECIMAL(18,2),
    @Change DECIMAL(18,2),
    @ReferenceNumber NVARCHAR(200) = NULL,
    @OrderItemsJson NVARCHAR(MAX),
    @OrderNumber NVARCHAR(40) OUTPUT,
    @OrderId INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    
    BEGIN TRY
        BEGIN TRANSACTION;
        
        DECLARE @OrderItems TABLE (
            RowNum INT IDENTITY(1,1),
            ProductVariantId INT,
            Quantity INT,
            Price DECIMAL(18,2),
            Subtotal DECIMAL(18,2),
            Modifiers NVARCHAR(MAX)
        );
        
        INSERT INTO @OrderItems (ProductVariantId, Quantity, Price, Subtotal, Modifiers)
        SELECT 
            ProductVariantId,
            Quantity,
            Price,
            Subtotal,
            Modifiers
        FROM OPENJSON(@OrderItemsJson)
        WITH (
            ProductVariantId INT '$.productVariantId',
            Quantity INT '$.quantity',
            Price DECIMAL(18,2) '$.price',
            Subtotal DECIMAL(18,2) '$.subtotal',
            Modifiers NVARCHAR(MAX) '$.modifiers' AS JSON
        );
        
        DECLARE @IngredientRequirements TABLE (
            StockItemId INT,
            StockItemName NVARCHAR(200),
            TotalQuantityNeeded DECIMAL(18,2),
            UnitOfMeasure NVARCHAR(40)
        );
        
        -- Get base ingredients from ProductVariantIngredients
        INSERT INTO @IngredientRequirements (StockItemId, StockItemName, TotalQuantityNeeded, UnitOfMeasure)
        SELECT 
            pvi.StockItemId,
            si.Name,
            SUM(pvi.QuantityNeeded * oi.Quantity),
            si.UnitOfMeasure
        FROM @OrderItems oi
        INNER JOIN ProductVariantIngredients pvi ON oi.ProductVariantId = pvi.ProductVariantId
        INNER JOIN StockItems si ON pvi.StockItemId = si.Id
        GROUP BY pvi.StockItemId, si.Name, si.UnitOfMeasure;
        
        -- ✅ Get misc items (cups) from ModifierStockItems
        -- First, update existing items if they match
        UPDATE ir
        SET ir.TotalQuantityNeeded = ir.TotalQuantityNeeded + misc_source.TotalQuantityNeeded
        FROM @IngredientRequirements ir
        INNER JOIN (
            SELECT 
                msi.StockItemId,
                SUM(msi.QuantityNeeded * oi.Quantity) AS TotalQuantityNeeded
            FROM @OrderItems oi
            INNER JOIN ProductVariants pv ON oi.ProductVariantId = pv.Id
            INNER JOIN ModifierStockItems msi ON pv.SizeId = msi.ModifierId
            GROUP BY msi.StockItemId
        ) misc_source ON ir.StockItemId = misc_source.StockItemId;
        
        -- Then, insert new misc items that don't exist yet
        INSERT INTO @IngredientRequirements (StockItemId, StockItemName, TotalQuantityNeeded, UnitOfMeasure)
        SELECT 
            msi.StockItemId,
            si.Name,
            SUM(msi.QuantityNeeded * oi.Quantity),
            si.UnitOfMeasure
        FROM @OrderItems oi
        INNER JOIN ProductVariants pv ON oi.ProductVariantId = pv.Id
        INNER JOIN ModifierStockItems msi ON pv.SizeId = msi.ModifierId
        INNER JOIN StockItems si ON msi.StockItemId = si.Id
        WHERE NOT EXISTS (
            SELECT 1 FROM @IngredientRequirements ir WHERE ir.StockItemId = msi.StockItemId
        )
        GROUP BY msi.StockItemId, si.Name, si.UnitOfMeasure;
        
        DECLARE @ValidationErrors TABLE (ErrorMessage NVARCHAR(500));
        
        IF NOT EXISTS (SELECT 1 FROM @IngredientRequirements)
            INSERT INTO @ValidationErrors (ErrorMessage)
            VALUES ('No ingredients found for the selected products. Cannot create order.');

        INSERT INTO @ValidationErrors (ErrorMessage)
        SELECT 
            'Insufficient stock for ' + ir.StockItemName + 
            '. Required: ' + CAST(ir.TotalQuantityNeeded AS NVARCHAR(20)) + ' ' + ir.UnitOfMeasure +
            ', Available: ' + CAST(ISNULL(SUM(
                CASE 
                    WHEN (sib.ExpiryDate IS NULL OR sib.ExpiryDate >= @OrderDate)
                         AND sib.DateUsed IS NULL 
                         AND sib.StockQuantity > 0 
                    THEN sib.StockQuantity 
                    ELSE 0 
                END
            ), 0) AS NVARCHAR(20)) + ' ' + ir.UnitOfMeasure
        FROM @IngredientRequirements ir
        LEFT JOIN StockItemBatches sib ON ir.StockItemId = sib.StockItemId
        GROUP BY ir.StockItemId, ir.StockItemName, ir.TotalQuantityNeeded, ir.UnitOfMeasure
        HAVING ISNULL(SUM(
            CASE 
                WHEN (sib.ExpiryDate IS NULL OR sib.ExpiryDate >= @OrderDate)
                     AND sib.DateUsed IS NULL 
                     AND sib.StockQuantity > 0 
                THEN sib.StockQuantity 
                ELSE 0 
            END
        ), 0) < ir.TotalQuantityNeeded;

        INSERT INTO @ValidationErrors (ErrorMessage)
        SELECT 
            'No valid batches found for ' + ir.StockItemName + 
            '. Required: ' + CAST(ir.TotalQuantityNeeded AS NVARCHAR(20)) + ' ' + ir.UnitOfMeasure
        FROM @IngredientRequirements ir
        WHERE NOT EXISTS (
            SELECT 1 
            FROM StockItemBatches sib 
            WHERE sib.StockItemId = ir.StockItemId
                AND (sib.ExpiryDate IS NULL OR sib.ExpiryDate >= @OrderDate)
                AND sib.DateUsed IS NULL
                AND sib.StockQuantity > 0
        );

        IF EXISTS (SELECT 1 FROM @ValidationErrors)
        BEGIN
            DECLARE @ErrorMsg NVARCHAR(MAX);
            SELECT @ErrorMsg = STRING_AGG(ErrorMessage, '; ') FROM @ValidationErrors;
            ROLLBACK TRANSACTION;
            SELECT 0 AS OrderId, NULL AS OrderNumber, 'ERROR' AS Status, @ErrorMsg AS Message;
            RETURN;
        END

        DECLARE @StockItemId INT, @QuantityNeeded DECIMAL(18,2), @RemainingToDeduct DECIMAL(18,2);
        DECLARE @BatchId INT, @BatchQuantity DECIMAL(18,2), @DeductAmount DECIMAL(18,2);
        
        DECLARE ingredient_cursor CURSOR FOR
        SELECT StockItemId, TotalQuantityNeeded FROM @IngredientRequirements;
        
        OPEN ingredient_cursor;
        FETCH NEXT FROM ingredient_cursor INTO @StockItemId, @QuantityNeeded;
        
        WHILE @@FETCH_STATUS = 0
        BEGIN
            SET @RemainingToDeduct = @QuantityNeeded;
            DECLARE batch_cursor CURSOR FOR
            SELECT Id, StockQuantity
            FROM StockItemBatches
            WHERE StockItemId = @StockItemId
                AND (ExpiryDate IS NULL OR ExpiryDate >= @OrderDate)
                AND DateUsed IS NULL
                AND StockQuantity > 0
            ORDER BY DateReceived ASC;

            OPEN batch_cursor;
            FETCH NEXT FROM batch_cursor INTO @BatchId, @BatchQuantity;
            
            WHILE @@FETCH_STATUS = 0 AND @RemainingToDeduct > 0
            BEGIN
                IF @BatchQuantity >= @RemainingToDeduct
                BEGIN
                    SET @DeductAmount = @RemainingToDeduct;
                    SET @RemainingToDeduct = 0;
                END
                ELSE
                BEGIN
                    SET @DeductAmount = @BatchQuantity;
                    SET @RemainingToDeduct = @RemainingToDeduct - @BatchQuantity;
                END

                UPDATE StockItemBatches
                SET StockQuantity = StockQuantity - @DeductAmount,
                    DateUsed = CASE WHEN (StockQuantity - @DeductAmount) <= 0 THEN @OrderDate ELSE DateUsed END
                WHERE Id = @BatchId;
                
                FETCH NEXT FROM batch_cursor INTO @BatchId, @BatchQuantity;
            END
            
            CLOSE batch_cursor;
            DEALLOCATE batch_cursor;
            
            FETCH NEXT FROM ingredient_cursor INTO @StockItemId, @QuantityNeeded;
        END

        CLOSE ingredient_cursor;
        DEALLOCATE ingredient_cursor;

        DECLARE @OrderCount INT;
        SELECT @OrderCount = COUNT(*) + 1 FROM Orders;
        SET @OrderNumber = 'ORD-' + FORMAT(@OrderDate, 'yyyyMMdd') + '-' + RIGHT('0000' + CAST(@OrderCount AS NVARCHAR), 4);
        
        INSERT INTO Orders (OrderNumber, UserId, OrderDate, TotalAmount, Status)
        VALUES (@OrderNumber, @UserId, @OrderDate, @TotalAmount, @Status);
        
        SET @OrderId = SCOPE_IDENTITY();
        
        DECLARE @CurrentProductVariantId INT, @CurrentQuantity INT, @CurrentPrice DECIMAL(18,2),
                @CurrentSubtotal DECIMAL(18,2), @CurrentModifiers NVARCHAR(MAX), @NewOrderItemId INT;
        
        DECLARE item_cursor CURSOR FOR
        SELECT ProductVariantId, Quantity, Price, Subtotal, Modifiers FROM @OrderItems;
        
        OPEN item_cursor;
        FETCH NEXT FROM item_cursor INTO @CurrentProductVariantId, @CurrentQuantity, @CurrentPrice, @CurrentSubtotal, @CurrentModifiers;
        
        WHILE @@FETCH_STATUS = 0
        BEGIN
            INSERT INTO OrderItems (OrderId, ProductVariantId, Quantity, Price, Subtotal)
            VALUES (@OrderId, @CurrentProductVariantId, @CurrentQuantity, @CurrentPrice, @CurrentSubtotal);
            
            SET @NewOrderItemId = SCOPE_IDENTITY();
            
            IF @CurrentModifiers IS NOT NULL AND @CurrentModifiers != '[]'
            BEGIN
                INSERT INTO OrderItemModifiers (OrderItemId, ModifierId, Quantity, Price, Subtotal)
                SELECT @NewOrderItemId, ModifierId, Quantity, Price, Subtotal
                FROM OPENJSON(@CurrentModifiers)
                WITH (
                    ModifierId INT '$.modifierId',
                    Quantity INT '$.quantity',
                    Price DECIMAL(18,2) '$.price',
                    Subtotal DECIMAL(18,2) '$.subtotal'
                );
            END
            
            FETCH NEXT FROM item_cursor INTO @CurrentProductVariantId, @CurrentQuantity, @CurrentPrice, @CurrentSubtotal, @CurrentModifiers;
        END
        
        CLOSE item_cursor;
        DEALLOCATE item_cursor;
        
        INSERT INTO Transactions (OrderId, PaymentType, AmountPaid, [Change], TransactionDate, ReferenceNumber)
        VALUES (@OrderId, @PaymentType, @AmountPaid, @Change, @OrderDate, @ReferenceNumber);
        
        COMMIT TRANSACTION;
        
        SELECT @OrderId AS OrderId, @OrderNumber AS OrderNumber, 'SUCCESS' AS Status, 'Order created successfully with inventory deducted (including misc items)' AS Message;
            
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION;
        SELECT 0 AS OrderId, NULL AS OrderNumber, 'ERROR' AS Status, ERROR_MESSAGE() AS Message;
        THROW;
    END CATCH
END
            ");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"
                IF OBJECT_ID('dbo.sp_InsertOrder', 'P') IS NOT NULL
                    DROP PROCEDURE dbo.sp_InsertOrder;
            ");
        }
    }
}