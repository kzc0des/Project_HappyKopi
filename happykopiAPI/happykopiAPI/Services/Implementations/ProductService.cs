using Dapper;
using happykopiAPI.DTOs.Product.Dropdown_Data;
using happykopiAPI.DTOs.Product.Incoming_Data;
using happykopiAPI.DTOs.Product.Internal;
using happykopiAPI.Enums;
using happykopiAPI.Services.Interfaces;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using System.Data;

namespace happykopiAPI.Services.Implementations
{
    public class ProductService : IProductService
    {
        private readonly IConfiguration _configuration;
        public ProductService(IConfiguration configuration)
        {
            _configuration = configuration;
        }
        private IDbConnection CreateConnection() => new SqlConnection(_configuration.GetConnectionString("LocalDB"));
        public async Task<IEnumerable<ModifierDto>> GetActiveSizesAsync()
        {
            using var connection = CreateConnection();

            var sizes = await connection.QueryAsync<ModifierDto>(
                    "sp_GetActiveSizes", 
                    commandType: CommandType.StoredProcedure
                );

            return sizes;
        }

        public async Task<IEnumerable<StockItemDto>> GetActiveLiquidAndPowderStockItemsAsync()
        {
            using var connection = CreateConnection();

            var stockItemsFromDb = await connection.QueryAsync<StockItemFromDbDto>(
                    "sp_GetPowderAndLiquidStockItems",
                    commandType: CommandType.StoredProcedure
                );

            var stockItems = stockItemsFromDb
                .Select(s => new StockItemDto
                {
                    Id = s.Id,
                    Name = s.Name,
                    UnitOfMeasure = s.UnitOfMeasure,
                    AlertLevel = s.AlertLevel,
                    ItemType = ((StockItemType)s.ItemType).ToString()
                })
                .ToList();

            return stockItems;
        }

        public async Task<IEnumerable<ModifierDto>> GetActiveAddOnsAsync()
        {
            using var connection = CreateConnection();

            var addOns = await connection.QueryAsync<ModifierDto>(
                    "sp_GetActiveAddOns",
                    commandType: CommandType.StoredProcedure
                );
            return addOns;
        }

        public async Task<IEnumerable<CategoryDto>> GetAllDrinkCategoriesAsync()
        {
            using var connection = CreateConnection();

            var categories = await connection.QueryAsync<CategoryDto>(
                "sp_GetActiveCategories",
                commandType: CommandType.StoredProcedure
            );

            return categories;
        }

        public async Task<int> CreateProductAsync(ProductCreateDto productDto)
        {
            await using var connection = new SqlConnection("LocalDB");
            await connection.OpenAsync();

            await using var transaction = await connection.BeginTransactionAsync();

            try
            {
                var productParams = new
                {
                    productDto.Name,
                    productDto.Description,
                    productDto.ImageUrl,
                    productDto.CategoryId
                };
                int newProductId = await connection.QuerySingleAsync<int>(
                    "sp_CreateProductMain",
                    productParams,
                    transaction: transaction,
                    commandType: System.Data.CommandType.StoredProcedure
                );

                foreach (var variant in productDto.Variants)
                {
                    var variantParams = new
                    {
                        ProductId = newProductId,
                        variant.Size,
                        variant.Price
                    };
                    int newVariantId = await connection.QuerySingleAsync<int>(
                        "sp_CreateProductVariant",
                        variantParams,
                        transaction: transaction, 
                        commandType: System.Data.CommandType.StoredProcedure
                    );

                    foreach (var ingredient in variant.Recipe)
                    {
                        var ingredientParams = new
                        {
                            VariantId = newVariantId,
                            ingredient.StockItemId,
                            ingredient.QuantityNeeded
                        };
                        await connection.ExecuteAsync(
                            "sp_CreateVariantIngredient",
                            ingredientParams,
                            transaction: transaction,
                            commandType: System.Data.CommandType.StoredProcedure
                        );
                    }

                    foreach (var addOn in variant.AddOns)
                    {
                        var addOnParams = new
                        {
                            VariantId = newVariantId,
                            addOn.ModifierId,
                            addOn.DefaultQuantity
                        };
                        await connection.ExecuteAsync(
                            "sp_CreateVariantAddOn",
                            addOnParams,
                            transaction: transaction,
                            commandType: System.Data.CommandType.StoredProcedure
                        );
                    }
                }

                await transaction.CommitAsync();

                return newProductId;
            }
            catch (Exception)
            {
                await transaction.RollbackAsync();
                throw; 
            }
        }
    }
}
