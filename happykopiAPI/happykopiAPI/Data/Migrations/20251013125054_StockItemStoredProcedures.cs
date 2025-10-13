using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace happykopiAPI.Data.Migrations
{
    /// <inheritdoc />
    public partial class StockItemStoredProcedures : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            var sp_GetStockItemById = @"
            CREATE PROCEDURE sp_GetStockItemById
                @StockItemId INT
            AS
            BEGIN
                SET NOCOUNT ON;

                SELECT
                    si.Id,
                    si.Name,
                    si.UnitOfMeasure,
                    si.AlertLevel,
                    si.IsPerishable,
                    si.ItemType,
                    si.IsActive,
                    ISNULL(SUM(sib.StockQuantity), 0) AS TotalStockQuantity,
                    COUNT(sib.Id) AS BatchCount
                FROM
                    dbo.StockItems si
                LEFT JOIN
                    dbo.StockItemBatches sib ON si.Id = sib.StockItemId
                WHERE
                    si.Id = @StockItemId
                GROUP BY
                    si.Id, si.Name, si.UnitOfMeasure, si.AlertLevel, si.IsPerishable, si.ItemType, si.IsActive;
            END";

            migrationBuilder.Sql(sp_GetStockItemById);

            var sp_GetAllStockItems = @"
            CREATE PROCEDURE sp_GetAllStockItems
            AS
            BEGIN
                SET NOCOUNT ON;

                SELECT
                    si.Id,
                    si.Name,
                    si.UnitOfMeasure,
                    si.AlertLevel,
                    ISNULL(SUM(sib.StockQuantity), 0) AS TotalStockQuantity,
                    si.IsActive,
                    COUNT(sib.Id) AS BatchCount 
                FROM
                    dbo.StockItems si
                LEFT JOIN
                    dbo.StockItemBatches sib ON si.Id = sib.StockItemId
                WHERE
                    si.IsActive = 1
                GROUP BY
                    si.Id, si.Name, si.UnitOfMeasure, si.AlertLevel, si.IsActive
                ORDER BY
                    si.Name;
            END";

            migrationBuilder.Sql(sp_GetAllStockItems);

            var sp_GetLowStockItems = @"
            CREATE PROCEDURE sp_GetLowStockItems
            AS
            BEGIN
                SET NOCOUNT ON;

                -- Gumagamit ng Common Table Expression (CTE) para mas malinis
                WITH StockTotals AS (
                    SELECT
                        StockItemId,
                        SUM(StockQuantity) AS TotalStock
                    FROM
                        dbo.StockItemBatches
                    GROUP BY
                        StockItemId
                )
                SELECT
                    si.Id,
                    si.Name,
                    si.UnitOfMeasure,
                    st.TotalStock AS TotalStockQuantity,
                    si.AlertLevel
                FROM
                    dbo.StockItems si
                JOIN
                    StockTotals st ON si.Id = st.StockItemId
                WHERE
                    si.IsActive = 1 AND st.TotalStock <= si.AlertLevel;
            END";

            migrationBuilder.Sql(sp_GetLowStockItems);

            var sp_UpdateStockItem = @"
            CREATE PROCEDURE sp_UpdateStockItem
                @StockItemId INT,
                @Name NVARCHAR(255),
                @Unit NVARCHAR(255),
                @AlertLevel DECIMAL(18, 2),
                @IsPerishable BIT,
                @ItemType INT,
                @UserId INT
            AS
            BEGIN
                SET XACT_ABORT ON;
                BEGIN TRANSACTION;

                IF EXISTS (SELECT 1 FROM dbo.StockItems WHERE Name = @Name AND Id != @StockItemId)
                    THROW 50002, 'Another ingredient with this name already exists.', 1;

                UPDATE dbo.StockItems
                SET
                    Name = @Name,
                    UnitOfMeasure = @Unit,
                    AlertLevel = @AlertLevel,
                    IsPerishable = @IsPerishable,
                    ItemType = @ItemType
                WHERE
                    Id = @StockItemId;

                COMMIT TRANSACTION;
            END";

            migrationBuilder.Sql(sp_UpdateStockItem);

            var sp_DeactivateStockItem = @"
            CREATE PROCEDURE sp_DeactivateStockItem
                @StockItemId INT,
                @UserId INT
            AS
            BEGIN
                UPDATE dbo.StockItems
                SET IsActive = 0
                WHERE Id = @StockItemId;
            END";

            migrationBuilder.Sql(sp_DeactivateStockItem);

            var sp_AdjustStockQuantity = @"
            CREATE PROCEDURE sp_AdjustStockQuantity
                @StockItemBatchId INT,
                @NewQuantity DECIMAL(18, 2),
                @UserId INT,
                @Remarks NVARCHAR(255)
            AS
            BEGIN
                SET XACT_ABORT ON;
                BEGIN TRANSACTION;

                DECLARE @StockItemId INT;
                DECLARE @StockQuantityBefore DECIMAL(18, 2);

                SELECT 
                    @StockItemId = StockItemId,
                    @StockQuantityBefore = StockQuantity
                FROM dbo.StockItemBatches
                WHERE Id = @StockItemBatchId;

                IF (@StockItemId IS NULL)
                    THROW 50003, 'Stock item batch not found.', 1;

                DECLARE @QuantityChanged DECIMAL(18, 2) = @NewQuantity - @StockQuantityBefore;

                UPDATE dbo.StockItemBatches
                SET StockQuantity = @NewQuantity
                WHERE Id = @StockItemBatchId;

                INSERT INTO dbo.StockLogs (
                    StockItemId,
                    BatchId,
                    UserId,
                    ChangeType,
                    QuantityChanged,
                    StockQuantityBefore,
                    StockQuantityAfter,
                    Remarks
                ) VALUES (
                    @StockItemId,
                    @StockItemBatchId,
                    @UserId,
                    3,
                    @QuantityChanged,
                    @StockQuantityBefore,
                    @NewQuantity,
                    @Remarks
                );

                COMMIT TRANSACTION;
            END";

            migrationBuilder.Sql(sp_AdjustStockQuantity);

            var sp_GetBatchesByStockItemId = @"
            CREATE PROCEDURE sp_GetBatchesByStockItemId
                @StockItemId INT
            AS
            BEGIN
                SET NOCOUNT ON;

                SELECT
                    Id,
                    StockQuantity,
                    ExpiryDate
                FROM
                    dbo.StockItemBatches
                WHERE
                    StockItemId = @StockItemId
                ORDER BY
                    ExpiryDate ASC;
            END";

            migrationBuilder.Sql(sp_GetBatchesByStockItemId);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("DROP PROCEDURE IF EXISTS dbo.sp_GetStockItemById");
            migrationBuilder.Sql("DROP PROCEDURE IF EXISTS dbo.sp_GetAllStockItems");
            migrationBuilder.Sql("DROP PROCEDURE IF EXISTS dbo.sp_GetLowStockItems");
            migrationBuilder.Sql("DROP PROCEDURE IF EXISTS dbo.sp_UpdateStockItem");
            migrationBuilder.Sql("DROP PROCEDURE IF EXISTS dbo.sp_DeactivateStockItem");
            migrationBuilder.Sql("DROP PROCEDURE IF EXISTS dbo.sp_AdjustStockQuantity");
            migrationBuilder.Sql("DROP PROCEDURE IF EXISTS dbo.sp_GetBatchesByStockItemId");
        }
    }
}
