using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace happykopiAPI.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddedCategoryProcedures : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            var sp_GetActiveProductsByCategoryId = @"
            CREATE OR ALTER PROCEDURE dbo.sp_GetActiveProductsByCategoryId
                @CategoryId INT
            AS
            BEGIN
                SET NOCOUNT ON;

                SELECT
                    p.Id,
                    p.Name,
                    c.Name AS CategoryName
                FROM
                    dbo.Products p
                INNER JOIN
                    dbo.Categories c ON p.CategoryId = c.Id
                WHERE
                    p.CategoryId = @CategoryId
                    AND p.IsActive = 1
                    AND p.IsAvailable = 1
                    AND c.IsActive = 1
            END
            GO";

            var sp_GetCategoryWithProductCountById = @"
            CREATE OR ALTER PROCEDURE dbo.sp_GetCategoryWithProductCountById
                @CategoryId INT
            AS
            BEGIN
                SET NOCOUNT ON;

                SELECT
                    c.Id,  
                    c.Name,
                    (SELECT COUNT(p.Id)
                     FROM dbo.Products p
                     WHERE p.CategoryId = c.Id AND p.IsAvailable = 1) AS ProductCount
                FROM
                    dbo.Categories c
                WHERE
                    c.Id = @CategoryId AND c.IsActive = 1;
            END
            GO";

            var sp_GetCategoriesWithProductCount = @"
            CREATE OR ALTER PROCEDURE dbo.sp_GetCategoriesWithProductCount
            AS
            BEGIN
                SET NOCOUNT ON;

                SELECT
                    c.Id,
                    c.Name,
                    (SELECT COUNT(p.Id)
                     FROM dbo.Products p
                     WHERE p.CategoryId = c.Id AND p.IsAvailable = 1 AND p.IsActive = 1) AS ProductCount
                FROM
                    dbo.Categories c
                WHERE
                    c.IsActive = 1;
            END
            GO";

            var sp_DeleteCategory = @"
            CREATE OR ALTER PROCEDURE dbo.sp_DeleteCategory
                @CategoryId INT
            AS
            BEGIN
                UPDATE dbo.Categories
                SET IsActive = 0
                WHERE Id = @CategoryId;
            END
            GO";

            var sp_UpdateCategory = @"
            CREATE OR ALTER PROCEDURE dbo.sp_UpdateCategory
                @CategoryId INT,
                @CategoryName NVARCHAR(100)
            AS
            BEGIN
                SET NOCOUNT ON;

                UPDATE dbo.Categories
                SET Name = @CategoryName
                WHERE Id = @CategoryId;
            END
            GO";

            var sp_CreateCategory = @"
            CREATE OR ALTER PROCEDURE dbo.sp_CreateCategory
                @CategoryName NVARCHAR(100)
            AS
            BEGIN
                SET NOCOUNT ON;

                INSERT INTO dbo.Categories (Name)
                VALUES (@CategoryName);

                SELECT SCOPE_IDENTITY();
            END
            GO";

            migrationBuilder.Sql(sp_GetActiveProductsByCategoryId);
            migrationBuilder.Sql(sp_GetCategoryWithProductCountById);
            migrationBuilder.Sql(sp_GetCategoriesWithProductCount);
            migrationBuilder.Sql(sp_DeleteCategory);
            migrationBuilder.Sql(sp_UpdateCategory);
            migrationBuilder.Sql(sp_CreateCategory);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("DROP PROCEDURE IF EXISTS dbo.sp_GetActiveProductsByCategoryId;");
            migrationBuilder.Sql("DROP PROCEDURE IF EXISTS dbo.sp_GetCategoryWithProductCountById;");
            migrationBuilder.Sql("DROP PROCEDURE IF EXISTS dbo.sp_GetCategoriesWithProductCount;");
            migrationBuilder.Sql("DROP PROCEDURE IF EXISTS dbo.sp_DeleteCategory;");
            migrationBuilder.Sql("DROP PROCEDURE IF EXISTS dbo.sp_UpdateCategory;");
            migrationBuilder.Sql("DROP PROCEDURE IF EXISTS dbo.sp_CreateCategory;");
        }
    }
}
