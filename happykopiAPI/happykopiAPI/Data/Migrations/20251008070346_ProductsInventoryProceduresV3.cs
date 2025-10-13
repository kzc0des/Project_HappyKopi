using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace happykopiAPI.Data.Migrations
{
    /// <inheritdoc />
    public partial class ProductsInventoryProceduresV3 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
			var sp_AddNewStockItem = @"
			CREATE PROCEDURE sp_AddNewStockItem
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
							BatchId,
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

			var sp_AddStockItemBatch = @"
			CREATE PROCEDURE sp_AddStockItemBatch
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
					BatchId,
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

			migrationBuilder.Sql(sp_AddStockItemBatch);

			var sp_AddNewProduct = @"
			CREATE PROCEDURE sp_AddNewProduct
			@Name NVARCHAR(150),
			@Description NVARCHAR(MAX) = NULL,
			@Price DECIMAL(18, 2),
			@ImageUrl NVARCHAR(MAX),
			@CategoryId INT,
			@Recipe dbo.ProductRecipeType READONLY
			AS
			BEGIN
				SET NOCOUNT ON;

				IF EXISTS (SELECT 1 FROM dbo.Products WHERE Name = @Name)
					THROW 50001, 'The product is already existing.', 1;
		
				BEGIN TRANSACTION
				BEGIN TRY
					INSERT INTO dbo.Products (
						Name, 
						Description, 
						Price, 
						ImageUrl,
						CategoryId
					)
					VALUES (
						@Name,
						@Description,
						@Price,
						@ImageUrl,
						@CategoryId
					);
		
					DECLARE @NewProductId INT;
					SET @NewProductId = SCOPE_IDENTITY();
		
					INSERT INTO dbo.ProductIngredients (
						ProductId,
						StockItemId,
						QuantityNeeded
					)
					SELECT 
						@NewProductId,
						IngredientId,
						QuantityNeeded
					FROM @Recipe;
		
					COMMIT TRANSACTION
				END TRY
				BEGIN CATCH
					IF @@TRANCOUNT > 0
						ROLLBACK TRANSACTION
					THROW;
				END CATCH
			END";

			migrationBuilder.Sql(sp_AddNewProduct);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
			migrationBuilder.Sql("DROP PROCEDURE IF EXISTS sp_AddNewStockItem");
			migrationBuilder.Sql("DROP PROCEDURE IF EXISTS sp_AddStockItemBatch");
			migrationBuilder.Sql("DROP PROCEDURE IF EXISTS sp_AddNewProduct");
        }
    }
}
