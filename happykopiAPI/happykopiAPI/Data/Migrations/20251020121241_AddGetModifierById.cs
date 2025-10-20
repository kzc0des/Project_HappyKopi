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
                    (
                        SELECT
                            msi.StockItemId,
                            si.Name AS StockItemName,
                            msi.QuantityNeeded
                        FROM
                            dbo.ModifierStockItems AS msi
                        JOIN
                            dbo.StockItems AS si ON msi.StockItemId = si.Id
                        WHERE
                            msi.ModifierId = m.Id
                        FOR JSON PATH
                    ) AS LinkedItems
                FROM
                    dbo.Modifiers AS m
                WHERE
                    m.Id = @ModifierId
                FOR JSON PATH, WITHOUT_ARRAY_WRAPPER;
            END;";

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
