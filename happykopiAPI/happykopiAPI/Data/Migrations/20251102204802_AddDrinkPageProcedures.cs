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
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("DROP PROCEDURE IF EXISTS sp_GetActiveSizes;");
            migrationBuilder.Sql("DROP PROCEDURE IF EXISTS sp_GetPowderAndLiquidStockItems;");
            migrationBuilder.Sql("DROP PROCEDURE IF EXISTS sp_GetActiveAddOns;");
            migrationBuilder.Sql("DROP PROCEDURE IF EXISTS sp_GetActiveCategories;");
        }
    }
}
