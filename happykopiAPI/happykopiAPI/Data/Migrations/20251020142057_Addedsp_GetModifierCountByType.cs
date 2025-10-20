using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace happykopiAPI.Data.Migrations
{
    /// <inheritdoc />
    public partial class Addedsp_GetModifierCountByType : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            var sp_GetModifierCountByType = @"
            CREATE OR ALTER PROCEDURE [dbo].[sp_GetModifierCountByType]
            AS
            BEGIN
                SET NOCOUNT ON;

                SELECT
                    CASE Type 
                        WHEN 0 THEN 'Sizes'
                        WHEN 1 THEN 'Add-Ons'
                    END AS ModifierType,
                    COUNT(Id) AS ModifierCount
                FROM
                    dbo.Modifiers
                GROUP BY
                    Type
                ORDER BY
                    Type;
            END";

            migrationBuilder.Sql(sp_GetModifierCountByType);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("DROP PROCEDURE IF EXISTS sp_GetModifierCountByType");
        }
    }
}
