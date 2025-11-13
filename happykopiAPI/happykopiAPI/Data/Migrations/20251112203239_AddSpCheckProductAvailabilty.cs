using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace happykopiAPI.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddSpCheckProductAvailabilty : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"
                IF OBJECT_ID('[dbo].[sp_CheckProductAvailability]', 'P') IS NOT NULL 
                    DROP PROCEDURE [dbo].[sp_CheckProductAvailability];
            ");

            migrationBuilder.Sql(@"
                CREATE PROCEDURE [dbo].[sp_CheckProductAvailability]
                    @CategoryId INT = NULL,
                    @CheckDate DATETIME2 = NULL
                AS
                BEGIN
                    SET NOCOUNT ON;

                    IF @CheckDate IS NULL
                        SET @CheckDate = GETDATE();

                    -- Create temporary tables first
                    IF OBJECT_ID('tempdb..#ProductIngredients') IS NOT NULL DROP TABLE #ProductIngredients;
                    IF OBJECT_ID('tempdb..#IngredientAvailability') IS NOT NULL DROP TABLE #IngredientAvailability;
                    IF OBJECT_ID('tempdb..#ProductAvailabilityStatus') IS NOT NULL DROP TABLE #ProductAvailabilityStatus;

                    -- Step 1: Get product-ingredient relationships
                    SELECT DISTINCT
                        p.Id AS ProductId,
                        p.Name AS ProductName,
                        c.Name AS CategoryName,
                        pv.Price,
                        p.ImageUrl,
                        pvi.StockItemId,
                        si.Name AS IngredientName,
                        pvi.QuantityNeeded,
                        si.UnitOfMeasure
                    INTO #ProductIngredients
                    FROM Products p
                    INNER JOIN Categories c ON p.CategoryId = c.Id
                    INNER JOIN ProductVariants pv ON p.Id = pv.ProductId
                    INNER JOIN ProductVariantIngredients pvi ON pv.Id = pvi.ProductVariantId
                    INNER JOIN StockItems si ON pvi.StockItemId = si.Id
                    WHERE p.IsActive = 1
                        AND (@CategoryId IS NULL OR p.CategoryId = @CategoryId);

                    -- Step 2: Compute ingredient-level stock and expiration
                    SELECT 
                        pi.ProductId,
                        pi.ProductName,
                        pi.CategoryName,
                        pi.Price,
                        pi.ImageUrl,
                        pi.StockItemId,
                        pi.IngredientName,
                        pi.QuantityNeeded,
                        pi.UnitOfMeasure,
                        ISNULL(SUM(
                            CASE 
                                WHEN sib.ExpiryDate >= @CheckDate 
                                     AND sib.DateUsed IS NULL 
                                     AND sib.StockQuantity > 0
                                THEN sib.StockQuantity
                                ELSE 0
                            END
                        ), 0) AS AvailableStock,
                        COUNT(CASE 
                            WHEN sib.ExpiryDate < @CheckDate 
                                 AND sib.DateUsed IS NULL
                            THEN 1 
                        END) AS ExpiredBatchCount,
                        COUNT(sib.Id) AS TotalBatchCount
                    INTO #IngredientAvailability
                    FROM #ProductIngredients pi
                    LEFT JOIN StockItemBatches sib ON pi.StockItemId = sib.StockItemId
                    GROUP BY 
                        pi.ProductId,
                        pi.ProductName,
                        pi.CategoryName,
                        pi.Price,
                        pi.ImageUrl,
                        pi.StockItemId,
                        pi.IngredientName,
                        pi.QuantityNeeded,
                        pi.UnitOfMeasure;

                    -- Step 3: Derive product-level availability
                    SELECT 
                        ia.ProductId,
                        ia.ProductName,
                        ia.CategoryName,
                        ia.Price,
                        ia.ImageUrl,
                        CASE 
                            WHEN MIN(CASE WHEN ia.AvailableStock >= ia.QuantityNeeded THEN 1 ELSE 0 END) = 1 
                            THEN 'AVAILABLE'
                            WHEN MAX(ia.ExpiredBatchCount) > 0 AND MAX(ia.AvailableStock) = 0
                            THEN 'EXPIRED_BATCHES'
                            ELSE 'INSUFFICIENT_STOCK'
                        END AS AvailabilityStatus
                    INTO #ProductAvailabilityStatus
                    FROM #IngredientAvailability ia
                    GROUP BY ia.ProductId, ia.ProductName, ia.CategoryName, ia.Price, ia.ImageUrl;

                    -- Result Set 1: Summary
                    SELECT 
                        ProductId,
                        ProductName,
                        CategoryName,
                        Price,
                        ImageUrl,
                        CAST(CASE WHEN AvailabilityStatus = 'AVAILABLE' THEN 1 ELSE 0 END AS BIT) AS IsAvailable
                    FROM #ProductAvailabilityStatus
                    ORDER BY 
                        CASE WHEN AvailabilityStatus = 'AVAILABLE' THEN 0 ELSE 1 END,
                        ProductName;

                    -- Result Set 2: Ingredient issues
                    SELECT 
                        ia.ProductId,
                        pas.AvailabilityStatus AS Reason,
                        ia.IngredientName,
                        ia.QuantityNeeded AS Required,
                        ia.AvailableStock AS Available,
                        ia.UnitOfMeasure,
                        ia.ExpiredBatchCount,
                        ia.TotalBatchCount
                    FROM #IngredientAvailability ia
                    INNER JOIN #ProductAvailabilityStatus pas ON ia.ProductId = pas.ProductId
                    WHERE pas.AvailabilityStatus != 'AVAILABLE'
                        AND ia.AvailableStock < ia.QuantityNeeded
                    ORDER BY ia.ProductId, ia.IngredientName;

                    DROP TABLE #ProductIngredients;
                    DROP TABLE #IngredientAvailability;
                    DROP TABLE #ProductAvailabilityStatus;
                END;
            ");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"
                IF OBJECT_ID('[dbo].[sp_CheckProductAvailability]', 'P') IS NOT NULL 
                    DROP PROCEDURE [dbo].[sp_CheckProductAvailability];
            ");
        }
    }
}
