using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace happykopiAPI.Data.Migrations
{
    /// <inheritdoc />
    public partial class OrderProcessingProceduresV3 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            var dbo_OrderItemType = @"
            CREATE TYPE dbo.OrderItemsType AS TABLE (
                a
                ProductId INT,
                Quantity INT
            );";

            migrationBuilder.Sql(dbo_OrderItemType);

            #region Refactored out in V3
            /*            
                         var dbo_OrderItemAddOnType = @"
                        CREATE TYPE dbo.OrderItemAddOnsType AS TABLE (
                            OrderItemIdentifier UNIQUEIDENTIFIER,
                            AddOnId INT,
                            Quantity INT
                        );";

                        migrationBuilder.Sql(dbo_OrderItemAddOnType);

                         var sp_CreateOrder = @"
                        CREATE PROCEDURE sp_CreateOrder
                            @UserId INT,
                            @OrderNumber NVARCHAR(20),
                            @OrderItems dbo.OrderItemsType READONLY,
                            @OrderItemAddOns dbo.OrderItemAddOnsType READONLY,
                            @TotalAmount DECIMAL(18, 2)
                        AS
                        BEGIN
                            SET NOCOUNT ON;

                            DECLARE @NewOrderId INT;

                            INSERT INTO dbo.Orders (
                            UserId, 
                            OrderNumber, 
                            TotalAmount
                            )VALUES(
                            @UserId, 
                            @OrderNumber, 
                            @TotalAmount
                            );

                            SET @NewOrderId = SCOPE_IDENTITY();

                            DECLARE @OrderItemMapping TABLE (
                                NewOrderItemId INT,
                                OrderItemIdentifier UNIQUEIDENTIFIER
                            );

                            MERGE INTO dbo.OrderItems AS target
                            USING (
                                SELECT 
                                    oi.OrderItemIdentifier, 
                                    oi.ProductId, 
                                    oi.Quantity, 
                                    p.Price
                                FROM @OrderItems AS oi
                                JOIN dbo.Products AS p ON oi.ProductId = p.Id
                            ) AS source
                            ON (1=0)
                            WHEN NOT MATCHED THEN
                                INSERT (
                                    OrderId, 
                                    ProductId, 
                                    Quantity, 
                                    Price, 
                                    Subtotal
                                )VALUES(
                                    @NewOrderId, 
                                    source.ProductId, 
                                    source.Quantity, 
                                    source.Price, 
                                    (source.Quantity * source.Price)
                                )
                            OUTPUT
                                inserted.Id,
                                source.OrderItemIdentifier 
                            INTO @OrderItemMapping (NewOrderItemId, OrderItemIdentifier);

                            INSERT INTO dbo.OrderItemAddOns (
                            OrderItemId, 
                            AddOnId,
                            Quantity,
                            Price,
                            Subtotal
                            )
                            SELECT
                                map.NewOrderItemId,
                                oia.AddOnId,
                                oia.Quantity,
                                a.Price,
                                (a.Price * oia.Quantity)
                            FROM @OrderItemAddOns AS oia
                            JOIN @OrderItemMapping AS map ON oia.OrderItemIdentifier = map.OrderItemIdentifier
                            JOIN dbo.AddOns AS a ON oia.AddOnId = a.Id;

                            SELECT @NewOrderId AS CreatedOrderId;
                        END";

                        migrationBuilder.Sql(sp_CreateOrder);

                        var sp_DeductStockFromOrder = @"
                        CREATE PROCEDURE sp_DeductStockFromOrder
                        @OrderId INT,
                        @UserId INT
                        AS
                        BEGIN
                            SET NOCOUNT ON;

                            DECLARE @RequiredStockItems TABLE (
                                StockItemId INT,
                                QuantityNeeded DECIMAL(18, 2),
                                ItemName NVARCHAR(100)
                            );

                            BEGIN TRANSACTION
                            BEGIN TRY

                            INSERT INTO @RequiredStockItems (StockItemId, QuantityNeeded)
                            SELECT
                                pi.StockItemId, -- Assuming IngredientId is now StockItemId
                                SUM(oi.Quantity * pi.QuantityNeeded)
                            FROM dbo.OrderItems oi
                            JOIN dbo.ProductIngredients pi ON oi.ProductId = pi.ProductId
                            WHERE oi.OrderId = @OrderId
                            GROUP BY pi.StockItemId;

                            ;WITH AddOnStock AS (
                                SELECT
                                    ai.IngredientId, -- Assuming IngredientId is now StockItemId
                                    SUM(oia.Quantity * ai.QuantityNeeded) AS AddOnQuantityNeeded
                                FROM dbo.OrderItemAddOns oia
                                JOIN dbo.OrderItems oi ON oia.OrderItemId = oi.Id
                                JOIN dbo.AddOns a ON oia.AddOnId = a.Id
                                JOIN dbo.AddOnIngredients ai ON a.Id = ai.AddOnId
                                WHERE oi.OrderId = @OrderId AND a.NeedsIngredientBreakdown = 1
                                GROUP BY ai.IngredientId
                            )

                            MERGE INTO @RequiredStockItems AS target
                            USING AddOnStock AS source
                            ON target.StockItemId = source.IngredientId
                            WHEN MATCHED THEN
                                UPDATE SET QuantityNeeded = target.QuantityNeeded + source.AddOnQuantityNeeded
                            WHEN NOT MATCHED BY TARGET THEN
                                INSERT (StockItemId, QuantityNeeded)
                                VALUES (source.IngredientId, source.AddOnQuantityNeeded);


                            UPDATE rsi
                                SET rsi.ItemName = si.Name
                                FROM @RequiredStockItems rsi
                                JOIN dbo.StockItems si ON rsi.StockItemId = si.Id;
                                DECLARE @InsufficientStockItem NVARCHAR(100);

                            SELECT TOP 1 @InsufficientStockItem = rsi.ItemName
                            FROM @RequiredStockItems AS rsi
                            LEFT JOIN (
                                SELECT 
                                    StockItemId, 
                                    SUM(StockQuantity) AS TotalStock 
                                FROM dbo.StockItemBatches 
                                WHERE StockQuantity > 0
                                GROUP BY StockItemId
                                ) AS AvailableStock 
                                ON rsi.StockItemId = AvailableStock.StockItemId
                                WHERE ISNULL(AvailableStock.TotalStock, 0) < rsi.QuantityNeeded;

                            IF @InsufficientStockItem IS NOT NULL
                            BEGIN
                                DECLARE @ErrorMsg NVARCHAR(255) = FORMATMESSAGE('Insufficient stock for item: %s. Order cannot be completed.', @InsufficientStockItem);
                                THROW 50003, @ErrorMsg, 1;
                            END

                            DECLARE @StockChanges TABLE (
                                BatchId INT,
                                StockItemId INT,
                                QuantityToDeduct DECIMAL(18, 4),
                                StockBefore DECIMAL(18, 4)
                            );    

                            ;WITH BatchesWithRunningTotal AS (
                                SELECT
                                    Id,
                                    StockItemId,
                                    StockQuantity,
                                    ExpiryDate,
                                        -- Calculate the cumulative stock for each item, ordered by expiry date (FEFO)
                                    SUM(StockQuantity) OVER (PARTITION BY StockItemId ORDER BY ExpiryDate ASC, Id ASC) AS RunningTotalStock
                                FROM dbo.StockItemBatches
                                WHERE StockQuantity > 0
                            ),
                            BatchCalculations AS (
                                SELECT
                                    b.Id AS BatchId,
                                    b.StockItemId,
                                    b.StockQuantity,
                                    b.RunningTotalStock,
                                    ISNULL(LAG(b.RunningTotalStock, 1, 0) OVER (PARTITION BY b.StockItemId ORDER BY b.ExpiryDate ASC, b.Id ASC), 0) AS PreviousBatchesStock,
                                    rsi.QuantityNeeded
                                FROM BatchesWithRunningTotal b
                                JOIN @RequiredStockItems rsi ON b.StockItemId = rsi.StockItemId
                           ),
                           StockToDeduct AS (
                                SELECT *
                                FROM BatchCalculations
                                WHERE PreviousBatchesStock < QuantityNeeded
                          )

                            UPDATE sib
                                SET
                                sib.StockQuantity = sib.StockQuantity - 
                                    CASE 
                                        WHEN s.RunningTotalStock >= s.QuantityNeeded
                                            THEN s.QuantityNeeded - s.PreviousBatchesStock
                                            ELSE s.StockQuantity 
                                        END
                            OUTPUT
                                inserted.Id, 
                                inserted.StockItemId,
                                deleted.StockQuantity - inserted.StockQuantity, 
                                deleted.StockQuantity
                            INTO @StockChanges (BatchId, StockItemId, QuantityToDeduct, StockBefore)
                            FROM dbo.StockItemBatches AS sib
                            JOIN StockToDeduct AS s ON sib.Id = s.BatchId;

                                DECLARE @OrderNumber NVARCHAR(20);
                                SELECT @OrderNumber = OrderNumber FROM dbo.Orders WHERE Id = @OrderId;

                                INSERT INTO dbo.StockLogs (
                                StockItemId, 
                                BatchId, 
                                UserId, 
                                ChangeType, 
                                QuantityChanged, 
                                StockQuantityBefore, 
                                StockQuantityAfter, 
                                Remarks
                                )
                                SELECT 
                                    sc.StockItemId, 
                                    sc.BatchId, 
                                    @UserId, 
                                    1, -- ChangeType 1 = 'Sale'
                                    -sc.QuantityToDeduct,
                                    sc.StockBefore, 
                                    (sc.StockBefore - sc.QuantityToDeduct),
                                    CONCAT('Sales From Order: ', @OrderNumber)
                                FROM @StockChanges AS sc;

                                COMMIT TRANSACTION;

                            END TRY
                            BEGIN CATCH
                                IF @@TRANCOUNT > 0
                                    ROLLBACK TRANSACTION; 
                                    THROW; 
                            END CATCH

                        END";

                        migrationBuilder.Sql(sp_DeductStockFromOrder);
            */
            #endregion

            var sp_RecordTransaction = @"
            CREATE PROCEDURE sp_RecordTransaction
                @OrderId INT,
                @Transactions dbo.TransactionsType READONLY
            AS
            BEGIN
                SET NOCOUNT ON;

                DECLARE @TotalAmount DECIMAL(18, 2);
                SELECT @TotalAmount = TotalAmount FROM dbo.Orders WHERE Id = @OrderId;

                DECLARE @AmountPaid DECIMAL(18, 2);
                SELECT @AmountPaid = SUM(AmountPaid) FROM @Transactions;

                INSERT INTO dbo.Transactions (OrderId, PaymentType, AmountPaid, Change, ReferenceNumber)
                SELECT
                    @OrderId,
                    PaymentType,
                    AmountPaid,
                    (@AmountPaid - @TotalAmount),
                    ReferenceNumber
                FROM @Transactions;

                SELECT (@AmountPaid - @TotalAmount) AS Change;
            END";

            migrationBuilder.Sql(sp_RecordTransaction);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("DROP TYPE IF EXISTS dbo.OrderItemsType;");
            migrationBuilder.Sql("DROP TYPE IF EXISTS dbo.OrderItemAddOnsType;");
            migrationBuilder.Sql("DROP PROCEDURE IF EXISTS sp_CreateOrder;");
            migrationBuilder.Sql("DROP PROCEDURE IF EXISTS sp_DeductStockFromOrder;");
            migrationBuilder.Sql("DROP PROCEDURE IF EXISTS sp_RecordTransaction;");
        }
    }
}
