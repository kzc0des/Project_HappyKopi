using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace happykopiAPI.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddCategoryNameToSp_GetProductsWithCategoryOf : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"
            ALTER PROCEDURE [dbo].[sp_GetProductsWithCategoryOf]
                @CategoryId INT
            AS
            BEGIN
                SET NOCOUNT ON;

                SELECT
                    p.Id,
                    p.Name,
                    p.Description,
                    p.ImageUrl,
                    p.IsAvailable,
                    p.CategoryId,
                    c.Name AS CategoryName
                FROM dbo.Products AS p
                INNER JOIN dbo.Categories AS c
                    ON p.CategoryId = c.Id
                WHERE p.CategoryId = @CategoryId;
            END
        ");

        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"
            ALTER PROCEDURE [dbo].[sp_GetProductsWithCategoryOf]
                @CategoryId INT
            AS
            BEGIN
                SET NOCOUNT ON;

                SELECT
                    Id,
                    Name,
                    Description, 
                    ImageUrl,
                    IsAvailable,
                    CategoryId
                FROM dbo.Products
                WHERE CategoryId = @CategoryId;
            END
        ");

        }
    }
}
