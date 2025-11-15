using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace happykopiAPI.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddedRefactoredProcedures : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            var spGetInactiveCategoriesSql = @"
        CREATE OR ALTER PROCEDURE [dbo].[sp_GetInactiveCategoriesWithProductCount]
        AS
        BEGIN
            SET NOCOUNT ON;
            SELECT
                c.Id,
                c.Name,
                (SELECT COUNT(p.Id)
                 FROM dbo.Products p
                 WHERE p.CategoryId = c.Id) AS ProductCount,
                 c.IsActive
            FROM
                dbo.Categories c
            WHERE
                c.IsActive = 0;
        END
        ";

            var spGetCategoryByIdSql = @"
        CREATE OR ALTER PROCEDURE [dbo].[sp_GetCategoryWithProductCountById]
            @CategoryId INT
        AS
        BEGIN
            SET NOCOUNT ON;
            SELECT
                c.Id,  
                c.Name,
                (SELECT COUNT(p.Id)
                 FROM dbo.Products p
                 WHERE p.CategoryId = c.Id) AS ProductCount,
                c.IsActive
            FROM
                dbo.Categories c
            WHERE
                c.Id = @CategoryId;
        END
        ";

            var spRestoreCategorySql = @"
        CREATE OR ALTER PROCEDURE [dbo].[sp_RestoreCategory]
            @CategoryId INT
        AS
        BEGIN
            UPDATE dbo.Categories
            SET IsActive = 1
            WHERE Id = @CategoryId;
        END
        ";

            migrationBuilder.Sql(spGetInactiveCategoriesSql);
            migrationBuilder.Sql(spGetCategoryByIdSql);
            migrationBuilder.Sql(spRestoreCategorySql);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("DROP PROCEDURE IF EXISTS [dbo].[sp_GetInactiveCategoriesWithProductCount]");
            migrationBuilder.Sql("DROP PROCEDURE IF EXISTS [dbo].[sp_GetCategoryWithProductCountById]");
            migrationBuilder.Sql("DROP PROCEDURE IF EXISTS [dbo].[sp_RestoreCategory]");
        }
    }
}
