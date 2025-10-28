using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace happykopiAPI.Data.Migrations
{
    /// <inheritdoc />
    public partial class Addedsp_GetModifiersByType : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            //var sp_GetModifiersByType = @"
            //CREATE OR ALTER PROCEDURE [dbo].[sp_GetModifiersByType]
            //    @ModifierType INT
            //AS
            //BEGIN
            //    SET NOCOUNT ON;

            //    SELECT
            //        Id,
            //        Name,
            //        Price
            //    FROM
            //        Modifiers
            //    WHERE
            //        Type = @ModifierType 
            //        AND IsAvailable = 1;
            //END";

            //migrationBuilder.Sql(sp_GetModifiersByType);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            //migrationBuilder.Sql("DROP PROCEDURE IF EXISTS sp_GetModifiersByType");
        }
    }
}
