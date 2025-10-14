using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace happykopiAPI.Data.Migrations
{
    /// <inheritdoc />
    public partial class Addedsp_GetStockItemCountByItemType : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            var sp_GetStockItemCountByItemType = @"
            CREATE PROCEDURE sp_GetStockItemCountByItemType
            AS
            BEGIN
                SET NOCOUNT ON;

                SELECT
                    CASE ItemType
                        WHEN 0 THEN 'Liquid'  
                        WHEN 1 THEN 'Powder' 
                        WHEN 2 THEN 'Miscellaneous'      
                        ELSE 'Uncategorized'
                    END AS ItemTypeName,
                    COUNT(Id) AS StockItemCount
                FROM
                    dbo.StockItems
                WHERE
                    IsActive = 1 
                GROUP BY
                    ItemType 
                ORDER BY
                    ItemTypeName;
            END";

            migrationBuilder.Sql(sp_GetStockItemCountByItemType);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("DROP PROCEDURE IF EXISTS dbo.sp_GetStockItemCountByItemType");
        }
    }
}
