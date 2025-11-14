using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace happykopiAPI.Data.Migrations
{
    /// <inheritdoc />
    public partial class ProductsProcedure : Migration
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

            var sp_GetProductDetailById = @"
CREATE OR ALTER PROCEDURE [dbo].[sp_GetProductDetailById]
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
        pv.SizeId,
        pv.Price,
        m.Name AS Size,
        m.OzAmount
    FROM ProductVariants pv
    JOIN Modifiers m ON pv.SizeId = m.Id
    WHERE pv.ProductId = @ProductId;
    
    -- Variant Ingredients
    SELECT
        pvi.ProductVariantId,
        pvi.StockItemId,
        pvi.StockItemId AS IngredientId,
        si.Name AS IngredientName,
        pvi.QuantityNeeded,
        si.ItemType,
        si.UnitOfMeasure
    FROM ProductVariantIngredients pvi
    JOIN ProductVariants pv ON pvi.ProductVariantId = pv.Id
    JOIN StockItems si ON pvi.StockItemId = si.Id
    WHERE pv.ProductId = @ProductId;
    
    -- Variant Add-ons
    SELECT
        pva.ProductVariantId,
        pva.ModifierId,
        pva.ModifierId AS AddOnId,
        m.Name AS ModifierName,
        pva.DefaultQuantity AS Times,
        m.Price
    FROM ProductVariantAddOns pva
    JOIN ProductVariants pv ON pva.ProductVariantId = pv.Id
    JOIN Modifiers m ON pva.ModifierId = m.Id
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

            var sp_CreateProductMain = @"
CREATE OR ALTER PROCEDURE sp_CreateProductMain
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

    INSERT INTO Products (Name, Description, ImageUrl, ImagePublicId, CategoryId, IsAvailable, IsActive)
    VALUES (@Name, @Description, @ImageUrl, @ImagePublicId, @CategoryId, @IsAvailable, @IsActive);

    SELECT SCOPE_IDENTITY() AS NewProductId;
END;
";
            migrationBuilder.Sql(sp_CreateProductMain);

            var sp_CreateProductVariant = @"
CREATE PROCEDURE sp_CreateProductVariant
    @ProductId INT,
    @SizeId INT,
    @Price DECIMAL(10, 2)
AS
BEGIN
    SET NOCOUNT ON;

    INSERT INTO ProductVariants (ProductId, SizeId, Price)
    VALUES (@ProductId, @SizeId, @Price);

    SELECT SCOPE_IDENTITY() AS NewProductVariantId;
END;
";
            migrationBuilder.Sql(sp_CreateProductVariant);

            var sp_CreateVariantIngredient = @"
CREATE OR ALTER PROCEDURE sp_CreateVariantIngredient
    @ProductVariantId INT,
    @StockItemId INT,
    @QuantityNeeded DECIMAL(10, 2)
AS
BEGIN
    SET NOCOUNT ON;

    INSERT INTO ProductVariantIngredients (ProductVariantId, StockItemId, QuantityNeeded)
    VALUES (@ProductVariantId, @StockItemId, @QuantityNeeded);
END;
";
            migrationBuilder.Sql(sp_CreateVariantIngredient);

            var sp_CreateVariantAddOn = @"
CREATE OR ALTER PROCEDURE sp_CreateVariantAddOn
    @ProductVariantId INT,
    @ModifierId INT,
    @DefaultQuantity INT
AS
BEGIN
    SET NOCOUNT ON;

    INSERT INTO ProductVariantAddOns (ProductVariantId, ModifierId, DefaultQuantity)
    VALUES (@ProductVariantId, @ModifierId, @DefaultQuantity);
END;
";
            migrationBuilder.Sql(sp_CreateVariantAddOn);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("DROP PROCEDURE IF EXISTS sp_GetActiveProducts;");
            migrationBuilder.Sql("DROP PROCEDURE IF EXISTS sp_GetProductDetailById;");
            migrationBuilder.Sql("DROP PROCEDURE IF EXISTS sp_UpdateProductMain;");
            migrationBuilder.Sql("DROP PROCEDURE IF EXISTS sp_DeleteProduct;");
            migrationBuilder.Sql("DROP PROCEDURE IF EXISTS sp_CreateProductMain;");
            migrationBuilder.Sql("DROP PROCEDURE IF EXISTS sp_CreateProductVariant;");
            migrationBuilder.Sql("DROP PROCEDURE IF EXISTS sp_CreateVariantIngredient;");
            migrationBuilder.Sql("DROP PROCEDURE IF EXISTS sp_CreateVariantAddOn;");
        }
    }
}
