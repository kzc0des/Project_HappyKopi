using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace happykopiAPI.Data.Migrations
{
    /// <inheritdoc />
    public partial class Renamedsp_GetModifierById : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
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
                    m.OzAmount,
                    Type = CASE m.Type
                               WHEN 0 THEN 'AddOn'
                               WHEN 1 THEN 'Option'
                               ELSE 'Unknown' 
                           END,
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
            END";

            migrationBuilder.Sql(sp_GetModifierById);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("DROP PROCEDURE IF EXISTS [dbo].[sp_GetModifierById]");
        }
    }
}
