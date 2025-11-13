using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace happykopiAPI.Data.Migrations
{
    /// <inheritdoc />
    public partial class Refactoredsp_GetActiveProducts : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            var sp_GetActiveProducts = @"
CREATE OR ALTER PROCEDURE sp_GetActiveProducts
    @CategoryId INT = NULL
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        p.Id,
        p.Name,
        c.Name AS CategoryName,
        p.ImageUrl
    FROM
        Products p
    JOIN
        Categories c ON p.CategoryId = c.Id
    WHERE
        p.IsActive = 1
        AND (@CategoryId IS NULL OR p.CategoryId = @CategoryId);
END;
";
            migrationBuilder.Sql(sp_GetActiveProducts);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("DROP PROCEDURE IF EXISTS sp_GetActiveProducts;");
        }
    }
}
