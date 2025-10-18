using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace happykopiAPI.Data.Migrations
{
    /// <inheritdoc />
    public partial class Refactoredsp_UpdateStockItem : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            var sp_UpdateStockItem = @"
            ALTER PROCEDURE sp_UpdateStockItem
                @StockItemId INT,
                @Name NVARCHAR(255),
                @Unit NVARCHAR(255),
                @AlertLevel DECIMAL(18, 2),
                @IsPerishable BIT,
                @ItemType INT,
                @IsActive BIT,
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
                    ItemType = @ItemType,
                    IsActive = @IsActive
                WHERE
                    Id = @StockItemId;

                COMMIT TRANSACTION;
            END";

            migrationBuilder.Sql(sp_UpdateStockItem);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("DROP PROCEDURE IF EXISTS sp_UpdateStockItem;");
        }
    }
}
