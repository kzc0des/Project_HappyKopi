using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace happykopiAPI.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddProductAndInventoryProcedures : Migration
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
            CREATE PROCEDURE sp_AddNewIngredient
				@UserId INT,
				@Name NVARCHAR(100),
				@StockQuantity DECIMAL(18, 2),
				@UnitOfMeasure NVARCHAR(20),
				@AlertLevel DECIMAL(18, 2)
            AS
            BEGIN
                SET NOCOUNT ON;
    
                BEGIN TRANSACTION;    
                BEGIN TRY
                    IF EXISTS (SELECT 1 FROM dbo.Ingredients WHERE Name = @Name)
                        THROW 50001, 'Ingredient is already existing.', 1;

                    DECLARE @NewIngredientId INT;
        
                    INSERT INTO dbo.Ingredients (
                        Name, 
                        StockQuantity, 
                        UnitOfMeasure,
                        AlertLevel
                    )
                    VALUES (
                        @Name,
                        @StockQuantity,
                        @UnitOfMeasure,
                        @AlertLevel
                    );
        
                    SET @NewIngredientId = SCOPE_IDENTITY();
        
                    INSERT INTO dbo.IngredientStockLogs (
                        IngredientId,
                        UserId,
                        ChangeType,
                        QuantityChanged,
                        StockQuantityBefore,
                        StockQuantityAfter,
                        Remarks
                    )
                    VALUES (
                        @NewIngredientId,
                        @UserId,
                        0,
                        @StockQuantity,
                        @StockQuantity,
                        @StockQuantity,
                        'Initial Stock Added'
                    );
        
                    COMMIT TRANSACTION;
                END TRY
                BEGIN CATCH
                    IF @@TRANCOUNT > 0
                        ROLLBACK TRANSACTION;
                        THROW;
                END CATCH
            END";

            migrationBuilder.Sql(sp_AddNewIngdredient);

			var sp_AddIngredientStock = @"
			CREATE PROCEDURE sp_AddIngredientStock
				@UserId INT,
				@IngredientId INT,
				@QuantityToAdd DECIMAL(18, 2),
				@Remarks NVARCHAR(255) = NULL
			AS
			BEGIN
				SET NOCOUNT ON;
	
				IF NOT EXISTS (SELECT 1 FROM dbo.Ingredients WHERE Id = @IngredientId)
					THROW 50001, 'Ingredient not found.', 1;
    
				BEGIN TRANSACTION
				BEGIN TRY

				DECLARE @StockBefore DECIMAL(18, 2);
				SELECT @StockBefore = StockQuantity FROM dbo.Ingredients WHERE Id = @IngredientId

				DECLARE @StockAfter DECIMAL(18, 2) = @StockBefore + @QuantityToAdd;
	
				UPDATE dbo.Ingredients
				SET 
					StockQuantity = @StockAfter          
				WHERE Id = @IngredientId;
        
					INSERT INTO dbo.IngredientStockLogs (
						IngredientId,
						UserId,
						ChangeType,
						QuantityChanged,
						StockQuantityBefore,
						StockQuantityAfter,
						Remarks
					)
					VALUES (
						@IngredientId,
						@UserId,
						0,
						@QuantityToAdd,
						@StockBefore,
						@StockAfter,
						@Remarks
					);
		
					COMMIT TRANSACTION
		
				END TRY
				BEGIN CATCH
					IF @@TRANCOUNT > 0
						ROLLBACK TRANSACTION
					THROW;
				END CATCH
			END";

			migrationBuilder.Sql(sp_AddIngredientStock);

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

			var dbo_ProductRecipeType = @"
			CREATE TYPE dbo.ProductRecipeType AS TABLE (
				IngredientId INT NOT NULL,
				QuantityNeeded DECIMAL(18, 2) NOT NULL
			)";

			migrationBuilder.Sql(dbo_ProductRecipeType);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
			migrationBuilder.Sql("DROP PROCEDURE IF EXISTS sp_AddNewCategory");
			migrationBuilder.Sql("DROP PROCEDURE IF EXISTS sp_AddNewProduct");
			migrationBuilder.Sql("DROP PROCEDURE IF EXISTS sp_AddNewIngredient");
			migrationBuilder.Sql("DROP PROCEDURE IF EXISTS sp_AddIngredientStock");
			migrationBuilder.Sql("DROP PROCEDURE IF EXISTS sp_GetProductsWithCategoryOf");
			migrationBuilder.Sql("DROP TYPE IF EXISTS dbo.ProductRecipeType");
        }
    }
}
