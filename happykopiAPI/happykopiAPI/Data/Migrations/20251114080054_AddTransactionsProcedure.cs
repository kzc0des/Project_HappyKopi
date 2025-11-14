using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace happykopiAPI.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddTransactionsProcedure : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"
                CREATE PROCEDURE [dbo].[sp_GetDailyTransactionSummary]
                AS
                BEGIN
                    SET NOCOUNT ON;
                    DECLARE @Today DATE = CAST(GETDATE() AS DATE);

                    SELECT
                        SUM(o.TotalAmount) AS TotalSalesToday,
                        COUNT(*) AS TransactionsToday,
                        SUM(CASE WHEN t.PaymentType = 'Cash' THEN 1 ELSE 0 END) AS CashPayments,
                        SUM(CASE WHEN t.PaymentType = 'Cashless' THEN 1 ELSE 0 END) AS CashlessPayments
                    FROM Transactions t
                    INNER JOIN Orders o ON o.Id = t.OrderId
                    WHERE CAST(t.TransactionDate AS DATE) = @Today;
                END
                ");

            migrationBuilder.Sql(@"
                CREATE PROCEDURE [dbo].[sp_GetTransactionHistoryToday]
                AS
                BEGIN
                    SET NOCOUNT ON;
                    DECLARE @Today DATE = CAST(GETDATE() AS DATE);

                    SELECT 
                        o.Id AS OrderId,
                        u.FullName AS BaristaName,
                        t.TransactionDate,
                        o.TotalAmount AS TotalAmount,
                        t.PaymentType AS PaymentMethod
                    FROM Transactions t
                    INNER JOIN Orders o ON o.Id = t.OrderId
                    INNER JOIN Users u ON o.UserId = u.Id
                    WHERE CAST(t.TransactionDate AS DATE) = @Today
                    ORDER BY t.TransactionDate DESC;
                END
                ");

            migrationBuilder.Sql(@"
                 CREATE PROCEDURE [dbo].[sp_GetTransactionDetails]
                    @OrderId INT
                AS
                BEGIN
                    SET NOCOUNT ON;

                    -- Transaction Details
                    SELECT 
                        o.Id AS OrderId,
                        o.TotalAmount AS Total,
                        t.TransactionDate,
                        t.PaymentType AS PaymentMethod,
                        u.FullName AS BaristaName,
                        t.AmountPaid,
                        t.Change,
                        t.ReferenceNumber
                    FROM Orders o
                    INNER JOIN Transactions t ON t.OrderId = o.Id
                    INNER JOIN Users u ON o.UserId = u.Id
                    WHERE o.Id = @OrderId;

                    -- Transaction Items
                    SELECT 
                        p.Name AS ProductName,
                        p.ImageUrl AS ProductImage,
                        oi.Quantity,
                        oi.Price AS Price
                    FROM OrderItems oi
                    INNER JOIN ProductVariants pv ON oi.ProductVariantId = pv.Id
                    INNER JOIN Products p ON pv.ProductId = p.Id
                    WHERE oi.OrderId = @OrderId;
                END
                ");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("DROP PROCEDURE IF EXISTS [dbo].[sp_GetDailyTransactionSummary];");
            migrationBuilder.Sql("DROP PROCEDURE IF EXISTS [dbo].[sp_GetTransactionHistoryToday];");
            migrationBuilder.Sql("DROP PROCEDURE IF EXISTS [dbo].[sp_GetTransactionDetails];");
        }
    }
}