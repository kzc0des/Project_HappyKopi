using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace happykopiAPI.Data.Migrations
{
    /// <inheritdoc />
    public partial class RefactoredCategoriesProcedure : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            var sp_AssignProductsToCategory = @"
CREATE OR ALTER PROCEDURE [dbo].[sp_AssignProductsToCategory]
    @CategoryId INT,
    @ProductIds dbo.IntList READONLY
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE p
    SET
        p.CategoryId = @CategoryId
    FROM
        dbo.Products p
    INNER JOIN
        @ProductIds idList ON p.Id = idList.Id
    WHERE
        p.CategoryId != @CategoryId; -- Opsyonal: para maiwasan ang unnecessary updates
END";

            migrationBuilder.Sql(sp_AssignProductsToCategory);

            var sp_GetActiveProductsByCategoryId = @"
            CREATE OR ALTER PROCEDURE [dbo].[sp_GetActiveProductsByCategoryId]
                @CategoryId INT
            AS
            BEGIN
                SET NOCOUNT ON;

                SELECT
                    p.Id,
                    p.Name,
                    c.Name AS CategoryName,
                    p.ImageUrl
                FROM
                    dbo.Products p
                INNER JOIN
                    dbo.Categories c ON p.CategoryId = c.Id
                WHERE
                    p.CategoryId != @CategoryId
                    AND p.IsActive = 1
                    AND p.IsAvailable = 1
                    AND c.IsActive = 1
            END";

            migrationBuilder.Sql(sp_GetActiveProductsByCategoryId);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("DROP PROCEDURE IF EXISTS [dbo].[sp_AssignProductsToCategory]");
            migrationBuilder.Sql("DROP PROCEDURE IF EXISTS [dbo].[sp_GetActiveProductsByCategoryId]");
        }
    }
}
