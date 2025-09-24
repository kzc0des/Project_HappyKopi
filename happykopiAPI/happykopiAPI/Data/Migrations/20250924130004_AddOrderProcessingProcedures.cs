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
            var sp_CreateOrder = @"
            ALTER PROCEDURE sp_CreateOrder
                @UserId INT,
                @OrderNumber NVARCHAR(20),
                @OrderItems dbo.OrderItemsType READONLY,
                @Transactions dbo.TransactionsType READONLY
            AS
            BEGIN
                SET XACT_ABORT ON;
                SET NOCOUNT ON;

                BEGIN TRANSACTION;
                BEGIN TRY
                    DECLARE @TotalAmount DECIMAL(18, 2);
                    SELECT @TotalAmount = SUM(oi.Quantity * p.Price)
                    FROM @OrderItems AS oi
                    JOIN dbo.Products AS p ON p.Id = oi.ProductId;

                    DECLARE @AmountPaid DECIMAL(18, 2);
                    SELECT @AmountPaid = SUM(AmountPaid)
                    FROM @Transactions;

                    IF (@TotalAmount > @AmountPaid)
                    BEGIN
                        DECLARE @ErrorMessage NVARCHAR(200);
                        SET @ErrorMessage = CONCAT('Insufficient payment. Total is ', @TotalAmount, ' but amount paid is only ', @AmountPaid, '.');
                        THROW 50001, @ErrorMessage, 1;
                    END

                    DECLARE @NewOrderId INT;
                    INSERT INTO dbo.Orders (
                        OrderNumber,
                        UserId,
                        TotalAmount,
                        Status
                    )
                    VALUES (
                        @OrderNumber,
                        @UserId,
                        @TotalAmount,
                        'Completed'
                    );
                    SET @NewOrderId = SCOPE_IDENTITY();

                    INSERT INTO dbo.OrderItems (
                        OrderId,
                        ProductId,
                        Quantity,
                        UnitPrice,
                        Subtotal
                    )
                    SELECT
                        @NewOrderId,
                        oi.ProductId,
                        oi.Quantity,
                        p.Price,
                        (oi.Quantity * p.Price)
                    FROM @OrderItems AS oi
                    JOIN dbo.Products AS p ON oi.ProductId = p.Id;

                    DECLARE @StockChanges AS TABLE (
                        IngredientId INT,
                        QuantityToDeduct DECIMAL (18, 2),
                        StockBefore DECIMAL (18, 2)
                    );

                    INSERT INTO @StockChanges (IngredientId, QuantityToDeduct, StockBefore)
                    SELECT
                        pi.IngredientId,
                        oi.Quantity * pi.QuantityNeeded,
                        ing.StockQuantity
                    FROM dbo.Ingredients AS ing
                    JOIN dbo.ProductIngredients AS pi ON ing.Id = pi.IngredientId
                    JOIN @OrderItems AS oi ON pi.ProductId = oi.ProductId;

                    UPDATE ing
                    SET
                        ing.StockQuantity = ing.StockQuantity - sc.QuantityToDeduct
                    FROM dbo.Ingredients AS ing
                    JOIN @StockChanges AS sc ON ing.Id = sc.IngredientId;

                    INSERT INTO dbo.IngredientStockLogs (
                        IngredientId,
			            UserId,
			            ChangeType,
			            QuantityChanged,
			            StockQuantityBefore,
			            StockQuantityAfter,
			            Remarks
		            )
		            SELECT 
			            sc.IngredientId,
			            @UserId,
			            1,
			            -sc.QuantityToDeduct,
			            sc.StockBefore,
			            (sc.StockBefore - sc.QuantityToDeduct),
			            CONCAT('Sales From Order: ', @OrderNumber)
                    FROM dbo.Ingredients AS ing
                    JOIN @StockChanges AS sc ON ing.Id = sc.IngredientId;

                    INSERT INTO dbo.Transactions (
                        OrderId,
                        PaymentType,
                        AmountPaid,
                        Change,
                        ReferenceNumber
                    )
                    SELECT
                        @NewOrderId,
                        t.PaymentType,
                        t.AmountPaid,
                        (@AmountPaid - @TotalAmount),
                        t.ReferenceNumber
                    FROM @Transactions AS T;

                    DECLARE @SUCCESSMESSAGE NVARCHAR(MAX) = CONCAT('Change is: ', (@TotalAmount - @AmountPaid));

                    COMMIT TRANSACTION;

                END TRY
                BEGIN CATCH
                    IF @@TRANCOUNT > 0
                        ROLLBACK TRANSACTION;

                    DECLARE @ErrorMsg NVARCHAR(4000) = ERROR_MESSAGE();
                    DECLARE @ErrorSeverity INT = ERROR_SEVERITY();
                    DECLARE @ErrorState INT = ERROR_STATE();

                    RAISERROR (@ErrorMsg, @ErrorSeverity, @ErrorState);
                END CATCH
            END";

            migrationBuilder.Sql(sp_CreateOrder);

            var dbo_TransactionType = @"
            CREATE TYPE dbo.TransactionsType AS TABLE (
	            PaymentType NVARCHAR(MAX) NOT NULL,
	            AmountPaid DECIMAL(18, 2) NOT NULL,
	            ReferenceNumber NVARCHAR(MAX)
            );";

            migrationBuilder.Sql(dbo_TransactionType);

            var dbo_OrderItemsType = @"
            CREATE TYPE dbo.OrderItemsType AS TABLE (
                ProductId INT NOT NULL,
                Quantity INT NOT NULL
            );";

            migrationBuilder.Sql(dbo_OrderItemsType);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("DROP PROCEDURE IF EXISTS sp_CreateOrder;");
            migrationBuilder.Sql("DROP TYPE IF EXISTS dbo.TransactionsType;");
            migrationBuilder.Sql("DROP TYPE IF EXISTS dbo.OrderItemsType;");
        }
    }
}
