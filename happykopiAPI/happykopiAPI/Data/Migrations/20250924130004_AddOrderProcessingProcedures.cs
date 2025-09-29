using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace happykopiAPI.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddOrderProcessingProcedures : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            #region Old Migration Code
            //var dbo_TransactionType = @"
            //CREATE TYPE dbo.TransactionsType AS TABLE (
            // PaymentType NVARCHAR(MAX) NOT NULL,
            // AmountPaid DECIMAL(18, 2) NOT NULL,
            // ReferenceNumber NVARCHAR(MAX)
            //);";

            //migrationBuilder.Sql(dbo_TransactionType);

            //var dbo_OrderItemsType = @"
            //CREATE TYPE dbo.OrderItemsType AS TABLE (
            //    OrderItemIdentifier INT NOT NULL,
            //    ProductId INT NOT NULL,
            //    Quantity INT NOT NULL
            //);";

            //migrationBuilder.Sql(dbo_OrderItemsType);

            //var dbo_OrderItemAddOnsType = @"
            //CREATE TYPE dbo.OrderItemAddOnsType AS TABLE (
            //    OrderItemIdentifier INT NOT NULL,
            //    AddOnId INT NOT NULL,
            //    Quantity INT NOT NULL
            //);";

            //var sp_CreateOrder = @"
            //CREATE PROCEDURE [dbo].[sp_CreateOrder]
            //    @UserId INT,
            //    @OrderNumber NVARCHAR(20),
            //    @OrderItems dbo.OrderItemsType READONLY,
            //    @OrderItemAddOns dbo.OrderItemAddOnsType READONLY,
            //    @Transactions dbo.TransactionsType READONLY
            //AS
            //BEGIN
            //    SET XACT_ABORT ON;
            //    SET NOCOUNT ON;

            //    BEGIN TRANSACTION;

            //    BEGIN TRY
            //        DECLARE @RequiredIngredients TABLE (
            //            IngredientId INT PRIMARY KEY,
            //            QuantityNeeded DECIMAL(18, 2)
            //        );

            //       DECLARE @AmountPaid DECIMAL(18, 2);
            //       SELECT @AmountPaid = SUM(AmountPaid)
            //       FROM @Transactions;

            //        INSERT INTO @RequiredIngredients (IngredientId, QuantityNeeded)
            //        SELECT
            //            pi.IngredientId,
            //            SUM(oi.Quantity * pi.QuantityNeeded) AS TotalQuantityNeeded
            //        FROM @OrderItems AS oi
            //        JOIN dbo.ProductIngredients AS pi ON oi.ProductId = pi.ProductId
            //        GROUP BY pi.IngredientId;

            //        SELECT * FROM @RequiredIngredients;

            //        ;WITH AddOnIngredients AS (
            //            SELECT
            //                ai.IngredientId,
            //                SUM(oia.Quantity * ai.QuantityNeeded) AS AddOnQuantityNeeded
            //            FROM @OrderItemAddOns AS oia
            //            JOIN dbo.AddOns AS a ON oia.AddOnId = a.Id
            //            JOIN dbo.AddOnIngredients AS ai ON a.Id = ai.AddOnId
            //            WHERE a.NeedsIngredientBreakdown = 1
            //            GROUP BY ai.IngredientId
            //        )

            //        MERGE INTO @RequiredIngredients AS target
            //        USING AddOnIngredients AS source
            //        ON target.IngredientId = source.IngredientId
            //        WHEN MATCHED THEN
            //            UPDATE SET target.QuantityNeeded = target.QuantityNeeded + source.AddOnQuantityNeeded
            //        WHEN NOT MATCHED BY TARGET THEN
            //            INSERT (IngredientId, QuantityNeeded)
            //            VALUES (source.IngredientId, source.AddOnQuantityNeeded);

            //        SELECT * FROM AddOnIngredients;
            //        SELECT * FROM @RequiredIngredients;

            //        DECLARE @InsufficientIngredient NVARCHAR(100);
            //        SELECT TOP 1 @InsufficientIngredient = i.Name
            //        FROM @RequiredIngredients AS ri
            //        LEFT JOIN (
            //            SELECT 
            //                IngredientId, 
            //                SUM(StockQuantity) AS TotalStock 
            //            FROM dbo.IngredientBatches 
            //            GROUP BY IngredientId
            //        ) AS AvailableStock ON ri.IngredientId = AvailableStock.IngredientId
            //        JOIN dbo.Ingredients i ON ri.IngredientId = i.Id
            //        WHERE ISNULL(AvailableStock.TotalStock, 0) < ri.QuantityNeeded;

            //        IF @InsufficientIngredient IS NOT NULL
            //        BEGIN
            //            DECLARE @ErrorMsg NVARCHAR(255) = FORMATMESSAGE('Insufficient stock for ingredient: %s.', @InsufficientIngredient);
            //            THROW 50003, @ErrorMsg, 1;
            //        END

            //        DECLARE @StockChanges TABLE (
            //            IngredientId INT,
            //            QuantityToDeduct DECIMAL(18, 2),
            //            StockBefore DECIMAL(18, 2)
            //        );

            //        ;WITH BatchesWithRunningTotal AS (
            //            SELECT
            //                Id,
            //                IngredientId,
            //                StockQuantity,
            //                ExpiryDate,
            //                SUM(StockQuantity) OVER (PARTITION BY IngredientId ORDER BY ExpiryDate ASC, Id ASC) AS RunningTotalStock
            //            FROM
            //                dbo.IngredientBatches
            //            WHERE StockQuantity > 0
            //        ),

            //        BatchCalculations AS (
            //            SELECT
            //                b.Id AS BatchId,
            //                b.IngredientId,
            //                b.StockQuantity,
            //                b.RunningTotalStock,
            //                ISNULL(LAG(b.RunningTotalStock, 1, 0) OVER (PARTITION BY b.IngredientId ORDER BY ExpiryDate ASC, b.Id ASC), 0) AS PreviousBatchesStock,
            //                ri.QuantityNeeded
            //            FROM
            //                BatchesWithRunningTotal b
            //            JOIN
            //                @RequiredIngredients ri ON b.IngredientId = ri.IngredientId
            //        ),

            //        StockToDeduct AS (
            //            SELECT *
            //            FROM BatchCalculations
            //            WHERE PreviousBatchesStock < QuantityNeeded
            //        )

            //        UPDATE ib
            //        SET
            //            ib.StockQuantity = ib.StockQuantity - 
            //                CASE 
            //                    WHEN s.PreviousBatchesStock + s.StockQuantity > s.QuantityNeeded 
            //                    THEN s.QuantityNeeded - s.PreviousBatchesStock
            //                    ELSE s.StockQuantity 
            //                END
            //        OUTPUT
            //            inserted.IngredientId,
            //            deleted.StockQuantity - inserted.StockQuantity,
            //            deleted.StockQuantity
            //        INTO @StockChanges (IngredientId, QuantityToDeduct, StockBefore)
            //        FROM
            //            dbo.IngredientBatches AS ib
            //        JOIN
            //            StockToDeduct AS s ON ib.Id = s.BatchId;

            //        INSERT INTO dbo.IngredientStockLogs (
            //            IngredientId, UserId, ChangeType, QuantityChanged,
            //            StockQuantityBefore, StockQuantityAfter, Remarks
            //        )
            //        SELECT 
            //            sc.IngredientId, @UserId, 1, -sc.QuantityToDeduct,
            //            sc.StockBefore, (sc.StockBefore - sc.QuantityToDeduct),
            //            CONCAT('Sales From Order: ', @OrderNumber)
            //        FROM 
            //            @StockChanges AS sc;

            //        DECLARE @TotalAmount DECIMAL(18, 2);
            //        SELECT @TotalAmount = ISNULL(SUM(ProductTotals.Subtotal), 0) + ISNULL(SUM(AddOnTotals.Subtotal), 0)
            //        FROM (
            //            SELECT SUM(oi.Quantity * p.Price) AS Subtotal 
            //            FROM @OrderItems AS oi 
            //            JOIN dbo.Products p ON oi.ProductId = p.Id
            //        ) AS ProductTotals,
            //        (
            //            SELECT SUM(oia.Quantity * a.Price) AS Subtotal 
            //            FROM @OrderItemAddOns AS oia 
            //            JOIN dbo.AddOns a ON oia.AddOnId = a.Id
            //        ) AS AddOnTotals;

            //        INSERT INTO dbo.Orders ( 
            //            UserId, 
            //            OrderNumber, 
            //            TotalAmount, 
            //            Status
            //        )
            //        VALUES (
            //            @UserId, 
            //            @OrderNumber, 
            //            @TotalAmount, 
            //            1
            //        );

            //        DECLARE @NewOrderId INT = SCOPE_IDENTITY();

            //        DECLARE @OrderItemMapping TABLE (
            //            OrderItemIdentifier INT, 
            //            NewOrderItemId INT
            //            );

            //        MERGE INTO dbo.OrderItems AS target
            //        USING (
            //            SELECT 
            //                oi.OrderItemIdentifier, 
            //                oi.ProductId, 
            //                oi.Quantity, 
            //                p.Price
            //            FROM @OrderItems AS oi
            //            JOIN dbo.Products AS p ON oi.ProductId = p.Id
            //        ) AS source
            //        ON (1=0) 
            //        WHEN NOT MATCHED THEN
            //            INSERT (
            //                OrderId, 
            //                ProductId, 
            //                Quantity, 
            //                UnitPrice, 
            //                Subtotal
            //           )
            //            VALUES (
            //                @NewOrderId, 
            //                source.ProductId, 
            //                source.Quantity, 
            //                source.Price, 
            //                (source.Quantity * source.Price)
            //           )
            //        OUTPUT
            //            inserted.Id,
            //            source.OrderItemIdentifier 
            //        INTO @OrderItemMapping (NewOrderItemId, OrderItemIdentifier);

            //        INSERT INTO dbo.OrderItemAddOns(OrderItemId, AddOnId, Price)
            //        SELECT 
            //            map.NewOrderItemId, 
            //            oia.AddOnId, 
            //            a.Price
            //        FROM @OrderItemAddOns AS oia 
            //        JOIN @OrderItemMapping AS map ON oia.OrderItemIdentifier = map.OrderItemIdentifier
            //        JOIN dbo.AddOns AS a ON oia.AddOnId = a.Id;

            //         INSERT INTO dbo.Transactions (
            //                        OrderId,
            //                        PaymentType,
            //                        AmountPaid,
            //                        Change,
            //                        ReferenceNumber
            //                    )
            //                    SELECT
            //                        @NewOrderId,
            //                        PaymentType,
            //                        AmountPaid,
            //                        (@AmountPaid - @TotalAmount),
            //                        ReferenceNumber
            //                    FROM @Transactions;

            //                    DECLARE @SUCCESSMESSAGE NVARCHAR(MAX) = CONCAT('Change is: ', (@TotalAmount - @AmountPaid));

            //        COMMIT TRANSACTION;

            //        SELECT @NewOrderId AS CreatedOrderId;

            //    END TRY
            //    BEGIN CATCH
            //        IF @@TRANCOUNT > 0
            //            ROLLBACK TRANSACTION;
            //        THROW;
            //    END CATCH
            //END";

            //migrationBuilder.Sql(sp_CreateOrder);
            #endregion
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            #region Old Migration Code
            //migrationBuilder.Sql("DROP PROCEDURE IF EXISTS sp_CreateOrder;");
            //migrationBuilder.Sql("DROP TYPE IF EXISTS dbo.TransactionsType;");
            //migrationBuilder.Sql("DROP TYPE IF EXISTS dbo.OrderItemsType;");
            #endregion
        }
    }
}
