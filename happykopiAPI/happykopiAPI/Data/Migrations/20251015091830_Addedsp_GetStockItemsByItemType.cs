using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace happykopiAPI.Data.Migrations
{
    /// <inheritdoc />
    public partial class Addedsp_GetStockItemsByItemType : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            var sp_GetStockItemsByItemType = @"
            CREATE PROCEDURE sp_GetStockItemsByItemType
                @ItemType INT
            AS
            BEGIN
                SET NOCOUNT ON;

                SELECT
                    si.Id,
                    si.Name,
                    si.UnitOfMeasure,
                    si.AlertLevel,
                    ISNULL(SUM(sib.StockQuantity), 0) AS TotalStockQuantity,
                    si.IsActive,
                    COUNT(sib.Id) AS BatchCount
                FROM
                    dbo.StockItems si
                LEFT JOIN
                    dbo.StockItemBatches sib ON si.Id = sib.StockItemId
                WHERE
                    si.ItemType = @ItemType AND si.IsActive = 1 -- Eto yung filter
                GROUP BY
                    si.Id, si.Name, si.UnitOfMeasure, si.AlertLevel, si.IsActive
                ORDER BY
                    si.Name;
            END";

            migrationBuilder.Sql(sp_GetStockItemsByItemType);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("DROP PROCEDURE IF EXISTS sp_GetStockItemsByItemType");
        }
    }
}
