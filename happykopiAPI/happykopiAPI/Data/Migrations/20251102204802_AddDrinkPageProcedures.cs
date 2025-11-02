using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace happykopiAPI.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddDrinkPageProcedures : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            var sp_GetActiveSizes = @"
CREATE OR ALTER PROCEDURE sp_GetActiveSizes
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        Id, 
        Name, 
        Price, 
        OzAmount 
    FROM 
        Modifiers
    WHERE 
        Type = 0
        AND IsActive = 1
        AND IsAvailable = 1;
END
";
            migrationBuilder.Sql(sp_GetActiveSizes);

            var sp_GetPowderAndLiquidStockItems = @"
CREATE OR ALTER PROCEDURE sp_GetPowderAndLiquidStockItems
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        Id,
        Name,
        UnitOfMeasure,
        AlertLevel,
        ItemType
    FROM 
        StockItems
    WHERE 
        IsActive = 1 AND
        (ItemType = 0 OR ItemType = 1);
END
";
            migrationBuilder.Sql(sp_GetPowderAndLiquidStockItems);

            var sp_GetActiveAddOns = @"
CREATE OR ALTER PROCEDURE sp_GetActiveAddOns
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        Id, 
        Name, 
        Price, 
        OzAmount 
    FROM 
        Modifiers
    WHERE 
        Type = 1
        AND IsActive = 1
        AND IsAvailable = 1;
END
";
            migrationBuilder.Sql(sp_GetActiveAddOns);

            var sp_GetActiveCategories = @"
CREATE OR ALTER PROCEDURE sp_GetActiveCategories
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        Id,
        Name
    FROM 
        Categories
    WHERE 
        IsActive = 1;
END
";
            migrationBuilder.Sql(sp_GetActiveCategories);

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
CREATE OR ALTER PROCEDURE sp_CreateProductVariant
    @ProductId INT,
    @Size NVARCHAR(50),
    @Price DECIMAL(10, 2)
AS
BEGIN
    SET NOCOUNT ON;

    INSERT INTO ProductVariants (ProductId, Size, Price)
    VALUES (@ProductId, @Size, @Price);

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
            migrationBuilder.Sql("DROP PROCEDURE IF EXISTS sp_GetActiveSizes;");
            migrationBuilder.Sql("DROP PROCEDURE IF EXISTS sp_GetPowderAndLiquidStockItems;");
            migrationBuilder.Sql("DROP PROCEDURE IF EXISTS sp_GetActiveAddOns;");
            migrationBuilder.Sql("DROP PROCEDURE IF EXISTS sp_GetActiveCategories;");
            migrationBuilder.Sql("DROP PROCEDURE IF EXISTS sp_CreateProductMain;");
            migrationBuilder.Sql("DROP PROCEDURE IF EXISTS sp_CreateProductVariant;");
            migrationBuilder.Sql("DROP PROCEDURE IF EXISTS sp_CreateVariantIngredient;");
            migrationBuilder.Sql("DROP PROCEDURE IF EXISTS sp_CreateVariantAddOn;");
        }
    }
}
