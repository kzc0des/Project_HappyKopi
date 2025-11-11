using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace happykopiAPI.Data.Migrations
{
    /// <inheritdoc />
    public partial class GetAllRelatedToOrderVariant : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // 1. T-SQL: Drop SP if it exists (Safety check)
            migrationBuilder.Sql(@"
                DROP PROCEDURE IF EXISTS [dbo].[sp_GetProductConfigurationByProductId];
GO
            ");

            // 2. T-SQL: Create the Stored Procedure
            var createSpSql = @"
                CREATE PROCEDURE [dbo].[sp_GetProductConfigurationByProductId]  
    @p_ProductId INT  
AS  
BEGIN  
    SET NOCOUNT ON;  
      
    -- 1. Get all Product Variants  
    SELECT   
        PV.Id,   
        PV.ProductId,   
        PV.Size,   
        PV.Price  
    FROM   
        dbo.ProductVariants AS PV   
    WHERE   
        PV.ProductId = @p_ProductId;  
      
    -- 2. Get all Variant Ingredients  
    SELECT   
        PVI.ProductVariantId,   
        PVI.StockItemId,   
        PVI.QuantityNeeded  
    FROM   
        dbo.ProductVariantIngredients AS PVI  
    INNER JOIN   
        dbo.ProductVariants AS PV ON PVI.ProductVariantId = PV.Id  
    WHERE   
        PV.ProductId = @p_ProductId;  
      
    -- 3. Get all Variant AddOns WITH MODIFIER DETAILS  
    SELECT   
        PVA.ProductVariantId,   
        PVA.ModifierId,  
        M.Name AS ModifierName,  
        M.Price AS ModifierPrice,  
        M.Type AS ModifierType,
        PVA.DefaultQuantity  
    FROM   
        dbo.ProductVariantAddOns AS PVA  
    INNER JOIN   
        dbo.ProductVariants AS PV ON PVA.ProductVariantId = PV.Id  
    INNER JOIN  
        dbo.Modifiers AS M ON PVA.ModifierId = M.Id  
    WHERE   
        PV.ProductId = @p_ProductId;
    
    -- 4. Get ALL Available Addons (THIS WAS MISSING!)
    SELECT 
        M.Id,
        M.Name,
        M.Price,
        M.Type
    FROM dbo.Modifiers AS M
    WHERE M.IsAvailable = 1 AND M.Type = 1;
      
END;
GO";

            migrationBuilder.Sql(createSpSql);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // T-SQL syntax to safely drop the stored procedure
            migrationBuilder.Sql("DROP PROCEDURE IF EXISTS GetProductConfigurationByProductId;");
        }
    }
}
