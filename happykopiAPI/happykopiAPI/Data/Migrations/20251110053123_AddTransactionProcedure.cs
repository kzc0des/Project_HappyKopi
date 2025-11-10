using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace happykopiAPI.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddTransactionProcedure : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            var sp_RecordTransaction = @"
                CREATE OR ALTER PROCEDURE [dbo].[sp_RecordTransaction]
                    @OrderId INT,
                    @Transactions dbo.TransactionsType READONLY
                AS
                BEGIN
                    SET NOCOUNT ON;

                    DECLARE @TotalAmount DECIMAL(18,2);
                    SELECT @TotalAmount = TotalAmount FROM dbo.Orders WHERE Id = @OrderId;

                    DECLARE @AmountPaid DECIMAL(18,2);
                    SELECT @AmountPaid = ISNULL(SUM(AmountPaid), 0) FROM @Transactions;

                    INSERT INTO dbo.Transactions (OrderId, PaymentType, AmountPaid, Change, ReferenceNumber)
                    SELECT
                        @OrderId,
                        t.PaymentType,
                        t.AmountPaid,
                        (@AmountPaid - ISNULL(@TotalAmount, 0)),
                        t.ReferenceNumber
                    FROM @Transactions AS t;

                    SELECT (@AmountPaid - ISNULL(@TotalAmount, 0)) AS Change;
                END";

            migrationBuilder.Sql(sp_RecordTransaction);

            var sp_GetTransactionById = @"
                    CREATE OR ALTER PROCEDURE [dbo].[sp_GetTransactionById]
                        @TransactionId INT
                    AS
                    BEGIN
                        SET NOCOUNT ON;

                        SELECT
                            t.Id,
                            t.OrderId,
                            o.OrderNumber,
                            u.FullName AS BaristaName,
                            t.PaymentType,
                            t.AmountPaid,
                            t.Change,
                            o.TotalAmount,
                            t.ReferenceNumber,
                            t.TransactionDate
                        FROM dbo.Transactions t
                        LEFT JOIN dbo.Orders o ON t.OrderId = o.Id
                        LEFT JOIN dbo.Users u ON o.UserId = u.Id
                        WHERE t.Id = @TransactionId;

                        SELECT
                            oi.Quantity,
                            pv.Size AS Variant,
                            p.Name AS ProductName,
                            oi.Price AS Price,
                            oi.Subtotal
                        FROM dbo.OrderItems oi
                        JOIN dbo.ProductVariants pv ON oi.ProductVariantId = pv.Id
                        JOIN dbo.Products p ON pv.ProductId = p.Id
                        WHERE oi.OrderId = (SELECT OrderId FROM dbo.Transactions WHERE Id = @TransactionId);
                    END";

            migrationBuilder.Sql(sp_GetTransactionById);

            var sp_GetTransactionByOrderId = @"
                CREATE OR ALTER PROCEDURE [dbo].[sp_GetTransactionByOrderId]
                    @OrderId INT
                AS
                BEGIN
                    SET NOCOUNT ON;

                    SELECT
                        t.Id,
                        t.OrderId,
                        o.OrderNumber,
                        u.FullName AS BaristaName,
                        t.PaymentType,
                        t.AmountPaid,
                        t.Change,
                        t.ReferenceNumber,
                        t.TransactionDate
                    FROM dbo.Transactions t
                    LEFT JOIN dbo.Orders o ON t.OrderId = o.Id
                    LEFT JOIN dbo.Users u ON o.UserId = u.Id
                    WHERE t.OrderId = @OrderId;
                END";

            migrationBuilder.Sql(sp_GetTransactionByOrderId);

            var sp_GetTransactions = @"
                CREATE OR ALTER PROCEDURE [dbo].[sp_GetTransactions]
                    @Page INT = 1,
                    @PageSize INT = 25
                AS
                BEGIN
                    SET NOCOUNT ON;

                    DECLARE @Offset INT = (@Page - 1) * @PageSize;

                    SELECT
                        t.Id,
                        t.OrderId,
                        o.OrderNumber,
                        u.FullName AS BaristaName,
                        t.PaymentType,
                        t.AmountPaid,
                        t.TransactionDate
                    FROM dbo.Transactions t
                    LEFT JOIN dbo.Orders o ON t.OrderId = o.Id
                    LEFT JOIN dbo.Users u ON o.UserId = u.Id
                    ORDER BY t.TransactionDate DESC
                    OFFSET @Offset ROWS FETCH NEXT @PageSize ROWS ONLY;
                END";

            migrationBuilder.Sql(sp_GetTransactions);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("DROP PROCEDURE IF EXISTS [dbo].[sp_RecordTransaction]");
            migrationBuilder.Sql("DROP PROCEDURE IF EXISTS [dbo].[sp_GetTransactionById]");
            migrationBuilder.Sql("DROP PROCEDURE IF EXISTS [dbo].[sp_GetTransactionByOrderId]");
            migrationBuilder.Sql("DROP PROCEDURE IF EXISTS [dbo].[sp_GetTransactions]");
        }
    }
}
