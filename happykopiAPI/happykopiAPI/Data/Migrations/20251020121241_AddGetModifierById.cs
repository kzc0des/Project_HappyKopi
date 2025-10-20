using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace happykopiAPI.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddGetModifierById : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<decimal>(
                name: "QuantityNeeded",
                table: "ModifierStockItems",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 1m,
                oldClrType: typeof(decimal),
                oldType: "decimal(18,2)");

            var sp_GetModifierById = @"
            CREATE OR ALTER PROCEDURE [dbo].[sp_GetModifierById]
                @ModifierId INT
            AS
            BEGIN
                SET NOCOUNT ON;
    
                SELECT
                    m.Id,
                    m.Name,
                    m.Price,
                    m.Type,
                    m.IsAvailable,
        
                    msi.StockItemId,
                    si.Name AS StockItemName,
                    msi.QuantityNeeded
                FROM
                    dbo.Modifiers AS m
                LEFT JOIN
                    dbo.ModifierStockItems AS msi ON m.Id = msi.ModifierId
                LEFT JOIN
                    dbo.StockItems AS si ON msi.StockItemId = si.Id
                WHERE
                    m.Id = @ModifierId; 
            END";

            migrationBuilder.Sql(sp_GetModifierById);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<decimal>(
                name: "QuantityNeeded",
                table: "ModifierStockItems",
                type: "decimal(18,2)",
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "decimal(18,2)",
                oldDefaultValue: 1m);

            migrationBuilder.Sql("DROP PROCEDURE IF EXISTS [dbo].[sp_GetModifierById];");
        }
    }
}
