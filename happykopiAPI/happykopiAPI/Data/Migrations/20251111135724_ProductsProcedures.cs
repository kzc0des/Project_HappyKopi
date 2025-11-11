using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace happykopiAPI.Data.Migrations
{
    /// <inheritdoc />
    public partial class ProductsProcedures : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            var sp_GetActiveProducts = @"
CREATE OR ALTER PROCEDURE sp_GetActiveProducts
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        p.Id,
        p.Name,
        c.Name AS CategoryName
    FROM
        Products p
    JOIN
        Categories c ON p.CategoryId = c.Id
    WHERE
        p.IsActive = 1;
END;
";
            migrationBuilder.Sql(sp_GetActiveProducts);

            var sp_GetProductDetailById = @"
CREATE OR ALTER PROCEDURE sp_GetProductDetailById
    @ProductId INT
AS
BEGIN
    SET NOCOUNT ON;

    -- Product Details
    SELECT
        p.Id,
        p.Name,
        p.Description,
        p.CategoryId,
        c.Name AS CategoryName,
        p.IsAvailable,
        p.IsActive,
        p.ImageUrl,
        p.ImagePublicId
    FROM Products p
    JOIN Categories c ON p.CategoryId = c.Id
    WHERE p.Id = @ProductId;

    -- Product Variants
    SELECT
        pv.Id,
        pv.Size,
        pv.Price
    FROM ProductVariants pv
    WHERE pv.ProductId = @ProductId;

    -- Variant Ingredients
    SELECT
        pvi.ProductVariantId,
        pvi.StockItemId,
        pvi.QuantityNeeded
    FROM ProductVariantIngredients pvi
    JOIN ProductVariants pv ON pvi.ProductVariantId = pv.Id
    WHERE pv.ProductId = @ProductId;

    -- Variant Add-ons
    SELECT
        pva.ProductVariantId,
        pva.ModifierId,
        pva.DefaultQuantity
    FROM ProductVariantAddOns pva
    JOIN ProductVariants pv ON pva.ProductVariantId = pv.Id
    WHERE pv.ProductId = @ProductId;
END;
";
            migrationBuilder.Sql(sp_GetProductDetailById);

            var sp_UpdateProductMain = @"
CREATE OR ALTER PROCEDURE sp_UpdateProductMain
    @ProductId INT,
    @Name NVARCHAR(100),
    @Description NVARCHAR(500) = NULL,
    @ImageUrl NVARCHAR(1000) = NULL,
    @ImagePublicId NVARCHAR(255) = NULL,
    @CategoryId INT,
    @IsAvailable BIT,
    @IsActive BIT
AS
BEGIN
    SET NOCOUNT ON;

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

    -- Clear old variants and related data
    DELETE FROM ProductVariantAddOns WHERE ProductVariantId IN (SELECT Id FROM ProductVariants WHERE ProductId = @ProductId);
    DELETE FROM ProductVariantIngredients WHERE ProductVariantId IN (SELECT Id FROM ProductVariants WHERE ProductId = @ProductId);
    DELETE FROM ProductVariants WHERE ProductId = @ProductId;
END;
";
            migrationBuilder.Sql(sp_UpdateProductMain);

            var sp_DeleteProduct = @"
CREATE OR ALTER PROCEDURE sp_DeleteProduct
    @ProductId INT
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE Products
    SET IsActive = 0
    WHERE Id = @ProductId;
END;
";
            migrationBuilder.Sql(sp_DeleteProduct);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("DROP PROCEDURE IF EXISTS sp_GetActiveProducts;");
            migrationBuilder.Sql("DROP PROCEDURE IF EXISTS sp_GetProductDetailById;");
            migrationBuilder.Sql("DROP PROCEDURE IF EXISTS sp_UpdateProductMain;");
            migrationBuilder.Sql("DROP PROCEDURE IF EXISTS sp_DeleteProduct;");
        }
    }
}
