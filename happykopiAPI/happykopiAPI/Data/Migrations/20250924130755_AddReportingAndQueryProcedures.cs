using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace happykopiAPI.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddReportingAndQueryProcedures : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            var sp_GetDailySalesReport = @"
            CREATE PROCEDURE sp_GetDailySalesReport
            @StartDate DATETIME,
            @EndDate DATETIME
            AS
            BEGIN
	            SET NOCOUNT ON;
	
	            SELECT
		            o.OrderNumber,
                o.OrderDate,
                o.TotalAmount,
                u.Username AS ProcessedBy,
                t.PaymentType
               FROM dbo.Orders AS o
               JOIN dbo.Users AS u ON o.UserId = u.Id
               LEFT JOIN dbo.Transactions AS T ON o.Id = t.OrderId
               WHERE o.OrderDate BETWEEN @StartDate AND @EndDate
               ORDER BY o.OrderDate DESC;
            END";

            migrationBuilder.Sql(sp_GetDailySalesReport);

            var sp_GetLowStockIngredients = @"
            CREATE PROCEDURE sp_GetLowStockIngredients
            AS
            BEGIN
                SET NOCOUNT ON;

                SELECT
                    Id,
                    Name,
                    StockQuantity,
                    AlertLevel,
                    UnitOfMeasure
                FROM dbo.Ingredients
                WHERE StockQuantity <= AlertLevel;
            END";

            migrationBuilder.Sql(sp_GetLowStockIngredients);

            var sp_GetAllProducts = @"
			CREATE PROCEDURE sp_GetAllProducts
			AS
			BEGIN
				SET NOCOUNT ON;

				SELECT
					Id,
					Name,
					Description,
					Price,
					ImageUrl,
					IsAvailable,
					CategoryId
				FROM dbo.Products
			END";

            migrationBuilder.Sql(sp_GetAllProducts);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("DROP PROCEDURE IF EXISTS sp_GetDailySalesReport");
            migrationBuilder.Sql("DROP PROCEDURE IF EXISTS sp_GetLowStockIngredients");
            migrationBuilder.Sql("DROP PROCEDURE IF EXISTS sp_GetAllProducts");
        }
    }
}
