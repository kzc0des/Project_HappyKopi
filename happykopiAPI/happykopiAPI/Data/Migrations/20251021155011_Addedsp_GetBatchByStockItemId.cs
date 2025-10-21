using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace happykopiAPI.Data.Migrations
{
    /// <inheritdoc />
    public partial class Addedsp_GetBatchByStockItemId : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            var sp_GetBatchByStockItemId = @"
            CREATE OR ALTER PROCEDURE [dbo].[sp_GetBatchByStockItemId]
            @BatchId INT,
            @StockItemId INT
            AS
            BEGIN
	            SELECT Id, StockQuantity, DateReceived, ExpiryDate
	            FROM dbo.StockItemBatches
	            WHERE Id = @BatchId AND StockItemId = @StockItemId
            END";

            migrationBuilder.Sql(sp_GetBatchByStockItemId);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("DROP PROCEDURE IF EXISTS [dbo].[sp_GetBatchByStockItemId]");
        }
    }
}
