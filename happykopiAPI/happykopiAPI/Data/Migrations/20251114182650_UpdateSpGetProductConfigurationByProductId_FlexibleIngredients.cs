using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace happykopiAPI.Data.Migrations
{
    public partial class UpdateSpGetProductConfigurationByProductId_FlexibleIngredients : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        { 
            migrationBuilder.Sql(@"
                IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'sp_GetProductConfigurationByProductId')
                    DROP PROCEDURE [dbo].[sp_GetProductConfigurationByProductId];
            ");
             
            migrationBuilder.Sql(@"
                CREATE PROCEDURE [dbo].[sp_GetProductConfigurationByProductId]  
                    @p_ProductId INT  
                AS  
                BEGIN  
                    SET NOCOUNT ON;  
                      
                    -- 1. Get ONLY Product Variants that HAVE ingredients
                    SELECT   
                        PV.Id,   
                        PV.ProductId,   
                        PV.SizeId,
                        ISNULL(M.Name, 'Regular') AS SizeName,
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
                    ORDER BY PV.Id;
                      
                    -- 2. Get all Variant Ingredients + Modifier Stock Items (FLEXIBLE)
                    SELECT   
                        PVI.ProductVariantId,   
                        PVI.StockItemId,
                        SI.Name AS StockItemName,
                        PVI.QuantityNeeded,
                        SI.UnitOfMeasure,
                        ISNULL(SUM(
                            CASE 
                                WHEN (SIB.ExpiryDate IS NULL OR SIB.ExpiryDate >= GETDATE())
                                     AND SIB.DateUsed IS NULL 
                                     AND SIB.StockQuantity > 0
                                THEN SIB.StockQuantity
                                ELSE 0
                            END
                        ), 0) AS AvailableStock,
                        0 AS IsModifierIngredient,
                        CAST(NULL AS INT) AS ModifierId
                    FROM   
                        dbo.ProductVariantIngredients AS PVI  
                    INNER JOIN   
                        dbo.ProductVariants AS PV ON PVI.ProductVariantId = PV.Id
                    INNER JOIN
                        dbo.StockItems AS SI ON PVI.StockItemId = SI.Id
                    LEFT JOIN
                        dbo.StockItemBatches AS SIB ON SI.Id = SIB.StockItemId
                    WHERE   
                        PV.ProductId = @p_ProductId
                        AND EXISTS (
                            SELECT 1 
                            FROM dbo.ProductVariantIngredients PVI2
                            WHERE PVI2.ProductVariantId = PV.Id
                        )
                    GROUP BY 
                        PVI.ProductVariantId, 
                        PVI.StockItemId, 
                        SI.Name, 
                        PVI.QuantityNeeded,
                        SI.UnitOfMeasure

                    UNION ALL

                    -- Get Modifier Stock Items (miscellaneous items linked to sizes - FLEXIBLE)
                    SELECT   
                        PV.Id AS ProductVariantId,
                        MSI.StockItemId,
                        SI.Name AS StockItemName,
                        MSI.QuantityNeeded,
                        SI.UnitOfMeasure,
                        ISNULL(SUM(
                            CASE 
                                WHEN (SIB.ExpiryDate IS NULL OR SIB.ExpiryDate >= GETDATE())
                                     AND SIB.DateUsed IS NULL 
                                     AND SIB.StockQuantity > 0
                                THEN SIB.StockQuantity
                                ELSE 0
                            END
                        ), 0) AS AvailableStock,
                        1 AS IsModifierIngredient,
                        MSI.ModifierId
                    FROM   
                        dbo.ProductVariants AS PV
                    INNER JOIN
                        dbo.ModifierStockItems AS MSI ON PV.SizeId = MSI.ModifierId
                    INNER JOIN
                        dbo.StockItems AS SI ON MSI.StockItemId = SI.Id
                    LEFT JOIN
                        dbo.StockItemBatches AS SIB ON SI.Id = SIB.StockItemId
                    WHERE   
                        PV.ProductId = @p_ProductId
                        AND PV.SizeId IS NOT NULL
                        AND EXISTS (
                            SELECT 1 
                            FROM dbo.ProductVariantIngredients PVI
                            WHERE PVI.ProductVariantId = PV.Id
                        )
                    GROUP BY 
                        PV.Id,
                        MSI.StockItemId, 
                        SI.Name, 
                        MSI.QuantityNeeded,
                        SI.UnitOfMeasure,
                        MSI.ModifierId

                    ORDER BY ProductVariantId, IsModifierIngredient, StockItemId;
                      
                    -- 3. Get all Variant AddOns WITH MODIFIER DETAILS
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
                    
                    -- 4. Get ALL Available Addons with Type = 1
                    SELECT DISTINCT
                        M.Id,
                        M.Name,
                        M.Price,
                        M.Type
                    FROM dbo.Modifiers AS M
                    WHERE M.IsAvailable = 1 AND M.Type = 1
                    ORDER BY M.Id;
                      
                END;
            ");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        { 
            migrationBuilder.Sql(@"
                IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'sp_GetProductConfigurationByProductId')
                    DROP PROCEDURE [dbo].[sp_GetProductConfigurationByProductId];
            ");
             
            migrationBuilder.Sql(@"
                CREATE PROCEDURE [dbo].[sp_GetProductConfigurationByProductId]  
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
                      
                    -- 2. Get all Variant Ingredients  
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
                      
                    -- 3. Get all Variant AddOns  
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
                    
                    -- 4. Get ALL Available Addons
                    SELECT 
                        M.Id,
                        M.Name,
                        M.Price,
                        M.Type
                    FROM dbo.Modifiers AS M
                    WHERE M.IsAvailable = 1 AND M.Type = 1;
                END;
            ");
        }
    }
}
