using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace happykopiAPI.Data.Migrations
{
    /// <inheritdoc />
    public partial class RefactoredAddStockItemAndStockItemBatch : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            var sp_AddNewStockItem = @"
			CREATE OR ALTER PROCEDURE [dbo].[sp_AddNewStockItem]
			@Name NVARCHAR(255),
			@Unit NVARCHAR(255),
			@AlertLevel DECIMAL(18, 2),
			@IsPerishable BIT,
			@ItemType INT,

			@InitialStockQuantity DECIMAL(18, 2),
			@ExpiryDate DATETIME=NULL,

			@UserId INT
			AS
			BEGIN
				SET XACT_ABORT ON;
				SET NOCOUNT ON;

				BEGIN TRANSACTION;
				BEGIN TRY
					IF EXISTS (SELECT 1 FROM dbo.StockItems WHERE Name = @Name)
						THROW 50001, 'An ingredient with this name already exists.', 1;

					INSERT INTO dbo.StockItems (
						Name,
						UnitOfMeasure,
						AlertLevel,
						IsPerishable,
						ItemType
					)VALUES(
						@Name,
						@Unit,
						@AlertLevel,
						@IsPerishable,
						@ItemType
					);

					DECLARE @NewStockItemId INT = SCOPE_IDENTITY();

					IF(@InitialStockQuantity > 0)
					BEGIN
						INSERT INTO dbo.StockItemBatches (
							StockItemId,
							StockQuantity,
							ExpiryDate
						)VALUES(
							@NewStockItemId,
							@InitialStockQuantity,
							@ExpiryDate
						)

						DECLARE @NewStockItemBatchId INT = SCOPE_IDENTITY();

						INSERT INTO dbo.StockLogs (
							StockItemId,
							StockItemBatchId,
							UserId,
							ChangeType,
							QuantityChanged,
							StockQuantityBefore,
							StockQuantityAfter,
							Remarks
						)VALUES(
							@NewStockItemId,
							@NewStockItemBatchId,
							@UserId,
							1,
							+@InitialStockQuantity,
							0,
							@InitialStockQuantity,
							'Initial Stock Added'
						)
					END

					COMMIT TRANSACTION;
				END TRY
				BEGIN CATCH
					IF @@TRANCOUNT > 0
						ROLLBACK TRANSACTION;
					THROW;
				END CATCH
			END";

			migrationBuilder.Sql(sp_AddNewStockItem);

			var sp_AddNewStockItemBatch = @"
			CREATE OR ALTER PROCEDURE [dbo].[sp_AddStockItemBatch]
			@StockItemId INT,
			@QuantityAdded DECIMAL(18, 2),
			@UserId INT,
			@ExpiryDate DATETIME = NULL,
			@Remarks NVARCHAR(255) = NULL
			AS
			BEGIN
				SET XACT_ABORT ON;
				SET NOCOUNT ON;

				BEGIN TRANSACTION
				BEGIN TRY

					INSERT INTO dbo.StockItemBatches (
					StockItemId,
					StockQuantity,
					ExpiryDate
					)VALUES(
					@StockItemId,
					@QuantityAdded,
					@ExpiryDate
					);

					DECLARE @NewBatchId INT = SCOPE_IDENTITY();

					DECLARE @StockQuantityBefore DECIMAL(18,2);
		
					SELECT @StockQuantityBefore = ISNULL(SUM(StockQuantity), 0)
					FROM dbo.StockItemBatches
					WHERE Id = @StockItemId;

					DECLARE @StockQuantityAfter DECIMAL(18,2) = @StockQuantityBefore + @QuantityAdded;

					INSERT INTO dbo.StockLogs (
					StockItemId,
					StockItemBatchId,
					UserId,
					ChangeType,
					QuantityChanged,
					StockQuantityBefore,
					StockQuantityAfter,
					Remarks
					)VALUES(
					@StockItemId,
					@NewBatchId,
					@UserId,
					0,
					+@QuantityAdded,
					@StockQuantityBefore,
					@StockQuantityAfter,
					'Added Another Stock'
					);

				COMMIT TRANSACTION
				END TRY
				BEGIN CATCH
					IF @@TRANCOUNT > 0
						ROLLBACK TRANSACTION;
						THROW;
				END CATCH
			END";

			migrationBuilder.Sql(sp_AddNewStockItemBatch);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
			migrationBuilder.Sql("DROP PROCEDURE IF EXISTS [dbo].[sp_AddNewStockItem]");
			migrationBuilder.Sql("DROP PROCEDURE IF EXISTS [dbo].[sp_AddStockItemBatch]");
        }
    }
}
