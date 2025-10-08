using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace happykopiAPI.Data.Migrations
{
    /// <inheritdoc />
    public partial class ProductsInventoryProceduresV2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            var sp_AddNewCategory = @"
            CREATE PROCEDURE sp_AddNewCategory
                @Name NVARCHAR(100)
            AS
            BEGIN
                SET NOCOUNT ON;
    
                SET @Name = LOWER(LTRIM(RTRIM(@Name)));
                IF EXISTS (SELECT 1 FROM dbo.Categories WHERE Name = @Name)
                    THROW 50002, 'Category with that name already exists.', 1;

                INSERT INTO dbo.Categories (Name)
                VALUES (@Name);
    
            END";

            migrationBuilder.Sql(sp_AddNewCategory);

            var dbo_ProductRecipeType = @"
			CREATE TYPE dbo.ProductRecipeType AS TABLE (
				IngredientId INT NOT NULL,
				QuantityNeeded DECIMAL(18, 2) NOT NULL
			)";

            migrationBuilder.Sql(dbo_ProductRecipeType);

            var dbo_AddOnRecipeType = @"
			CREATE TYPE dbo.AddOnRecipeType AS TABLE (
				IngredientId INT NOT NULL,
				QuantityNeeded DECIMAL(18, 2) NOT NULL
			)";

            migrationBuilder.Sql(dbo_AddOnRecipeType);

            #region Refactored out in V2
            /*            var sp_AddNewProduct = @"
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
									IngredientId,
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

						var sp_AddNewIngdredient = @"
						CREATE PROCEDURE [dbo].[sp_AddNewIngredient]
							@Name NVARCHAR(100),
							@UnitOfMeasure NVARCHAR(20),
							@AlertLevel DECIMAL(18, 2),
							@IsPerishable BIT,

							@InitialStockQuantity DECIMAL(18, 2),
							@ExpiryDate DATETIME = NULL,

							@UserId INT
						AS
						BEGIN
							SET XACT_ABORT ON;
							SET NOCOUNT ON;

							BEGIN TRANSACTION;

							BEGIN TRY
								IF EXISTS (SELECT 1 FROM dbo.Ingredients WHERE Name = @Name)
									THROW 50001, 'An ingredient with this name already exists.', 1;

								INSERT INTO dbo.Ingredients (
									Name,
									UnitOfMeasure,
									AlertLevel,
									IsPerishable
								)
								VALUES (
									@Name,
									@UnitOfMeasure,
									@AlertLevel,
									@IsPerishable
								);

								DECLARE @NewIngredientId INT = SCOPE_IDENTITY();

								IF @InitialStockQuantity > 0
								BEGIN
									-- Insert sa IngredientBatches table
									INSERT INTO dbo.IngredientBatches (
										IngredientId,
										StockQuantity,
										ExpiryDate
									)
									VALUES (
										@NewIngredientId,
										@InitialStockQuantity,
										@ExpiryDate
									);

									-- Step 3: Mag-log sa IngredientStockLogs
									INSERT INTO dbo.IngredientStockLogs (
										IngredientId,
										UserId,
										ChangeType, -- 0 para sa 'StockIn'
										QuantityChanged,
										StockQuantityBefore,
										StockQuantityAfter,
										Remarks
									)
									VALUES (
										@NewIngredientId,
										@UserId,
										0, -- 'StockIn'
										@InitialStockQuantity,
										0, -- Dahil bago pa lang, ang stock before ay 0
										@InitialStockQuantity,
										'Initial stock for new ingredient'
									);
								END

								COMMIT TRANSACTION;

								SELECT @NewIngredientId AS NewIngredientId;

							END TRY
							BEGIN CATCH
								IF @@TRANCOUNT > 0
									ROLLBACK TRANSACTION;
								THROW;
							END CATCH
						END";

						migrationBuilder.Sql(sp_AddNewIngdredient);

						var sp_AddIngredientBatch = @"
						CREATE PROCEDURE [dbo].[sp_AddIngredientBatch]
							@IngredientId INT,
							@QuantityAdded DECIMAL(18, 2),
							@UserId INT,
							@ExpiryDate DATETIME = NULL,
							@Remarks NVARCHAR(255) = NULL
						AS
						BEGIN
							SET XACT_ABORT ON;
							SET NOCOUNT ON;

							BEGIN TRANSACTION;

							BEGIN TRY
								DECLARE @TotalStockBefore DECIMAL(18, 2);
								SELECT @TotalStockBefore = ISNULL(SUM(StockQuantity), 0)
								FROM dbo.IngredientBatches
								WHERE IngredientId = @IngredientId AND StockQuantity > 0;

								INSERT INTO dbo.IngredientBatches (
									IngredientId,
									StockQuantity,
									DateReceived,
									ExpiryDate
								)
								VALUES (
									@IngredientId,
									@QuantityAdded,
									GETDATE(),
									@ExpiryDate
								);
								DECLARE @TotalStockAfter DECIMAL(18, 2) = @TotalStockBefore + @QuantityAdded;

								INSERT INTO dbo.IngredientStockLogs (
									IngredientId,
									UserId,
									ChangeType, -- 0 para sa 'StockIn'
									QuantityChanged,
									StockQuantityBefore,
									StockQuantityAfter,
									Remarks
								)
								VALUES (
									@IngredientId,
									@UserId,
									0, -- 'StockIn'
									@QuantityAdded,
									@TotalStockBefore,
									@TotalStockAfter,
									'Stock Added'
								);

								COMMIT TRANSACTION;

							END TRY
							BEGIN CATCH
								IF @@TRANCOUNT > 0
									ROLLBACK TRANSACTION;

								THROW;
							END CATCH
						END";

						migrationBuilder.Sql(sp_AddIngredientBatch);
			*/
            #endregion

            var sp_GetProductsWithCategory = @"
            CREATE PROCEDURE sp_GetProductsWithCategoryOf
				@CategoryId INT
			AS
			BEGIN
				SET NOCOUNT ON;

				SELECT
					Id,
					Name,
					Description,
					Price,
					ImageUrl,
					IsAvailable,
					CategoryId
				FROM dbo.Products
				WHERE CategoryId = @CategoryId;
			END";

            migrationBuilder.Sql(sp_GetProductsWithCategory);

            var sp_AddNewAddOn = @"
			CREATE PROCEDURE [dbo].[sp_AddNewAddOn]
				@Name NVARCHAR(100),
				@Price DECIMAL(18, 2),
				@NeedsIngredientBreakdown BIT,
				@StockQuantity DECIMAL(18, 2) = NULL,
				@AlertLevel DECIMAL(18, 2) = NULL,
				@UnitOfMeasure NVARCHAR(20) = NULL,
				@ExpiryDate DATETIME = NULL,
				@Recipe dbo.AddOnRecipeType READONLY
			AS
			BEGIN
				SET XACT_ABORT ON;
				SET NOCOUNT ON;

				BEGIN TRANSACTION;

				BEGIN TRY
        
					IF EXISTS (SELECT 1 FROM dbo.AddOns WHERE Name = @Name)
						THROW 50005, 'An add-on with this name already exists.', 1;
        
					IF @NeedsIngredientBreakdown = 1 AND NOT EXISTS (SELECT 1 FROM @Recipe)
						THROW 50006, 'Ingredient-based add-ons must have a recipe.', 1;
        
					IF @NeedsIngredientBreakdown = 0 AND (@StockQuantity IS NULL OR @AlertLevel IS NULL)
						THROW 50007, 'Self-contained add-ons must have a Stock Quantity and Alert Level.', 1;

					INSERT INTO dbo.AddOns (
						Name,
						Price,
						NeedsIngredientBreakdown,
						StockQuantity,
						AlertLevel,
						UnitOfMeasure,
						ExpiryDate,
						LastUpdated
					)
					VALUES (
						@Name,
						@Price,
						@NeedsIngredientBreakdown,
						@StockQuantity,
						@AlertLevel,
						@UnitOfMeasure,
						@ExpiryDate,
						GETDATE()
					);

					DECLARE @NewAddOnId INT = SCOPE_IDENTITY();

					IF @NeedsIngredientBreakdown = 1
					BEGIN
						INSERT INTO dbo.AddOnIngredients (AddOnId, IngredientId, QuantityNeeded)
						SELECT @NewAddOnId, r.IngredientId, r.QuantityNeeded
						FROM @Recipe AS r;
					END

					COMMIT TRANSACTION;

					SELECT @NewAddOnId AS NewAddOnId;

				END TRY
				BEGIN CATCH
					IF @@TRANCOUNT > 0
						ROLLBACK TRANSACTION;
					THROW;
				END CATCH
			END";

            migrationBuilder.Sql(sp_AddNewAddOn);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("DROP PROCEDURE IF EXISTS sp_AddNewCategory");
            migrationBuilder.Sql("DROP PROCEDURE IF EXISTS sp_GetProductsWithCategoryOf");
            migrationBuilder.Sql("DROP TYPE IF EXISTS dbo.ProductRecipeType");
            migrationBuilder.Sql("DROP TYPE IF EXISTS dbo.AddOnRecipeType");
            migrationBuilder.Sql("DROP PROCEDURE IF EXISTS sp_AddNewAddOn");
            #region Refactored out in V2
            //migrationBuilder.Sql("DROP PROCEDURE IF EXISTS sp_AddNewProduct");
            //migrationBuilder.Sql("DROP PROCEDURE IF EXISTS sp_AddNewIngredient");
            //migrationBuilder.Sql("DROP PROCEDURE IF EXISTS sp_AddIngredientBatch");
            #endregion
        }
    }
}
