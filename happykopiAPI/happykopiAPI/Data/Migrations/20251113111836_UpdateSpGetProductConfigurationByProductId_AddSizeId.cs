using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace happykopiAPI.Data.Migrations
{
    /// <inheritdoc />
    public partial class UpdateSpGetProductConfigurationByProductId_AddSizeId : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            var sql = @"
                CREATE OR ALTER PROCEDURE [dbo].[sp_GetProductConfigurationByProductId]  
                    @p_ProductId INT  
                AS  
                BEGIN  
                    SET NOCOUNT ON;  
                      
                    -- 1. Get ONLY Product Variants that HAVE ingredients
                    SELECT   
                        PV.Id,   
                        PV.ProductId,   
                        PV.SizeId,
                        ISNULL(M.Name, 'Regular') AS SizeName,  -- Handle NULL case
                        PV.Price  
                    FROM   
                        dbo.ProductVariants AS PV   
                    LEFT JOIN 
                        dbo.Modifiers AS M ON PV.SizeId = M.Id
                    WHERE   
                        PV.ProductId = @p_ProductId
                        AND EXISTS (
                            SELECT 1 
                            FROM dbo.ProductVariantIngredients PVI 
                            WHERE PVI.ProductVariantId = PV.Id
                        )
                    ORDER BY PV.Id;  -- Ensure consistent ordering
                      
                    -- 2. Get all Variant Ingredients (only for variants that will be shown)
                    SELECT   
                        PVI.ProductVariantId,   
                        PVI.StockItemId,
                        SI.Name AS StockItemName,
                        PVI.QuantityNeeded  
                    FROM   
                        dbo.ProductVariantIngredients AS PVI  
                    INNER JOIN   
                        dbo.ProductVariants AS PV ON PVI.ProductVariantId = PV.Id
                    INNER JOIN
                        dbo.StockItems AS SI ON PVI.StockItemId = SI.Id
                    WHERE   
                        PV.ProductId = @p_ProductId
                        AND EXISTS (
                            SELECT 1 
                            FROM dbo.ProductVariantIngredients PVI2
                            WHERE PVI2.ProductVariantId = PV.Id
                        )
                    ORDER BY PVI.ProductVariantId, PVI.StockItemId;
                      
                    -- 3. Get all Variant AddOns WITH MODIFIER DETAILS (DISTINCT to avoid duplicates)
                    SELECT DISTINCT
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
                        PV.ProductId = @p_ProductId
                        AND EXISTS (
                            SELECT 1 
                            FROM dbo.ProductVariantIngredients PVI
                            WHERE PVI.ProductVariantId = PV.Id
                        )
                    ORDER BY PVA.ProductVariantId, PVA.ModifierId;
                    
                    -- 4. Get ALL Available Addons with Type = 1 (DISTINCT to avoid duplicates)
                    SELECT DISTINCT
                        M.Id,
                        M.Name,
                        M.Price,
                        M.Type
                    FROM dbo.Modifiers AS M
                    WHERE M.IsAvailable = 1 AND M.Type = 1
                    ORDER BY M.Id;
                      
                END;
                GO";

            migrationBuilder.Sql(sql);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            var sql = @"
                CREATE OR ALTER PROCEDURE [dbo].[sp_GetProductConfigurationByProductId]  
                    @p_ProductId INT  
                AS  
                BEGIN  
                    SET NOCOUNT ON;  
                      
                    -- 1. Get ONLY Product Variants that HAVE ingredients
                    SELECT   
                        PV.Id,   
                        PV.ProductId,   
                        PV.SizeId,
                        M.Name AS SizeName,  
                        PV.Price  
                    FROM   
                        dbo.ProductVariants AS PV   
                    LEFT JOIN 
                        dbo.Modifiers AS M ON PV.SizeId = M.Id
                    WHERE   
                        PV.ProductId = @p_ProductId
                        AND EXISTS (
                            SELECT 1 
                            FROM dbo.ProductVariantIngredients PVI 
                            WHERE PVI.ProductVariantId = PV.Id
                        );
                      
                    -- 2. Get all Variant Ingredients (only for variants that will be shown)
                    SELECT   
                        PVI.ProductVariantId,   
                        PVI.StockItemId,
                        SI.Name AS StockItemName,
                        PVI.QuantityNeeded  
                    FROM   
                        dbo.ProductVariantIngredients AS PVI  
                    INNER JOIN   
                        dbo.ProductVariants AS PV ON PVI.ProductVariantId = PV.Id
                    INNER JOIN
                        dbo.StockItems AS SI ON PVI.StockItemId = SI.Id
                    WHERE   
                        PV.ProductId = @p_ProductId
                        AND EXISTS (
                            SELECT 1 
                            FROM dbo.ProductVariantIngredients PVI2
                            WHERE PVI2.ProductVariantId = PV.Id
                        );
                      
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
                        PV.ProductId = @p_ProductId
                        AND EXISTS (
                            SELECT 1 
                            FROM dbo.ProductVariantIngredients PVI
                            WHERE PVI.ProductVariantId = PV.Id
                        );
                    
                    -- 4. Get ALL Available Addons with Type = 1
                    SELECT 
                        M.Id,
                        M.Name,
                        M.Price,
                        M.Type
                    FROM dbo.Modifiers AS M
                    WHERE M.IsAvailable = 1 AND M.Type = 1;
                      
                END;
                GO";

            migrationBuilder.Sql(sql);
        }
    }
}