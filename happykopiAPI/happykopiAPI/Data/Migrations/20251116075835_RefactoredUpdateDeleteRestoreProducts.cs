using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace happykopiAPI.Data.Migrations
{
    /// <inheritdoc />
    public partial class RefactoredUpdateDeleteRestoreProducts : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            var sp_RestoreProduct = @"
            ALTER PROCEDURE [dbo].[sp_RestoreProduct]
                @ProductId INT
            AS
            BEGIN
                UPDATE dbo.Products
                SET IsActive = 1, IsAvailable = 1
                WHERE Id = @ProductId;
            END";

            var sp_DeleteProduct = @"
            ALTER PROCEDURE [dbo].[sp_DeleteProduct]
                @ProductId INT
            AS
            BEGIN
                SET NOCOUNT ON;

                UPDATE Products
                SET IsActive = 0, IsAvailable = 0
                WHERE Id = @ProductId;
            END;";

            var sp_UpdateProductMain = @"
            ALTER PROCEDURE [dbo].[sp_UpdateProductMain]
                @ProductId INT,
                @Name NVARCHAR(100),
                @Description NVARCHAR(500) = NULL,
                @ImageUrl NVARCHAR(1000) = NULL,
                @ImagePublicId NVARCHAR(255) = NULL,
                @CategoryId INT,
                @IsAvailable BIT = 1,
                @IsActive BIT = 1
            AS
            BEGIN
                SET NOCOUNT ON;

                -- Only update the main product details.
                -- The variants and their components will be preserved.
                UPDATE Products
                SET
                    Name = @Name,
                    Description = @Description,
                    ImageUrl = @ImageUrl,
                    ImagePublicId = @ImagePublicId,
                    CategoryId = @CategoryId,
                    IsAvailable = @IsAvailable,
                    IsActive = @IsActive
                WHERE Id = @ProductId;
            END;";

            migrationBuilder.Sql(sp_RestoreProduct);
            migrationBuilder.Sql(sp_DeleteProduct);
            migrationBuilder.Sql(sp_UpdateProductMain);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("DROP PROCEDURE IF EXISTS [dbo].[sp_RestoreProduct]");
            migrationBuilder.Sql("DROP PROCEDURE IF EXISTS [dbo].[sp_DeleteProduct]");
            migrationBuilder.Sql("DROP PROCEDURE IF EXISTS [dbo].[sp_UpdateProductMain]");
        }
    }
}
