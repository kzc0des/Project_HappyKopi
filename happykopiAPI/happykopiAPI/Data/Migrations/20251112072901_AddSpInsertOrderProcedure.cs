using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace happykopiAPI.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddSpInsertOrderProcedure : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
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
                        
                        -- Generate unique order number
                        DECLARE @OrderCount INT;
                        SELECT @OrderCount = COUNT(*) + 1 FROM Orders;
                        SET @OrderNumber = 'ORD-' + FORMAT(@OrderDate, 'yyyyMMdd') + '-' + RIGHT('0000' + CAST(@OrderCount AS NVARCHAR), 4);
                        
                        -- Insert into Orders table
                        INSERT INTO Orders (OrderNumber, UserId, OrderDate, TotalAmount, Status)
                        VALUES (@OrderNumber, @UserId, @OrderDate, @TotalAmount, @Status);
                        
                        SET @OrderId = SCOPE_IDENTITY();
                        
                        -- Parse and insert OrderItems with Modifiers
                        DECLARE @OrderItems TABLE (
                            ProductVariantId INT,
                            Quantity INT,
                            Price DECIMAL(18,2),
                            Subtotal DECIMAL(18,2),
                            Modifiers NVARCHAR(MAX)
                        );
                        
                        -- Parse the JSON array of order items
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
                        
                        -- Insert order items and their modifiers
                        DECLARE @CurrentProductVariantId INT;
                        DECLARE @CurrentQuantity INT;
                        DECLARE @CurrentPrice DECIMAL(18,2);
                        DECLARE @CurrentSubtotal DECIMAL(18,2);
                        DECLARE @CurrentModifiers NVARCHAR(MAX);
                        DECLARE @NewOrderItemId INT;
                        
                        DECLARE item_cursor CURSOR FOR
                        SELECT ProductVariantId, Quantity, Price, Subtotal, Modifiers
                        FROM @OrderItems;
                        
                        OPEN item_cursor;
                        FETCH NEXT FROM item_cursor INTO @CurrentProductVariantId, @CurrentQuantity, @CurrentPrice, @CurrentSubtotal, @CurrentModifiers;
                        
                        WHILE @@FETCH_STATUS = 0
                        BEGIN
                            -- Insert OrderItem
                            INSERT INTO OrderItems (OrderId, ProductVariantId, Quantity, Price, Subtotal)
                            VALUES (@OrderId, @CurrentProductVariantId, @CurrentQuantity, @CurrentPrice, @CurrentSubtotal);
                            
                            SET @NewOrderItemId = SCOPE_IDENTITY();
                            
                            -- Insert OrderItemModifiers if modifiers exist
                            IF @CurrentModifiers IS NOT NULL AND @CurrentModifiers != '[]'
                            BEGIN
                                INSERT INTO OrderItemModifiers (OrderItemId, ModifierId, Quantity, Price, Subtotal)
                                SELECT 
                                    @NewOrderItemId,
                                    ModifierId,
                                    Quantity,
                                    Price,
                                    Subtotal
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
                        
                        -- Insert Transaction
                        INSERT INTO Transactions (OrderId, PaymentType, AmountPaid, [Change], TransactionDate, ReferenceNumber)
                        VALUES (@OrderId, @PaymentType, @AmountPaid, @Change, @OrderDate, @ReferenceNumber);
                        
                        COMMIT TRANSACTION;
                        
                        -- Return success
                        SELECT 
                            @OrderId AS OrderId,
                            @OrderNumber AS OrderNumber,
                            'SUCCESS' AS Status,
                            'Order created successfully' AS Message;
                            
                    END TRY
                    BEGIN CATCH
                        IF @@TRANCOUNT > 0
                            ROLLBACK TRANSACTION;
                        
                        -- Return error information
                        SELECT 
                            0 AS OrderId,
                            NULL AS OrderNumber,
                            'ERROR' AS Status,
                            ERROR_MESSAGE() AS Message;
                            
                        THROW;
                    END CATCH
                END
            ");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("DROP PROCEDURE IF EXISTS [dbo].[sp_InsertOrder]");
        }
    }
}
