﻿using Dapper;
﻿using Dapper;
using happykopiAPI.DTOs.Product.Dropdown_Data;
using happykopiAPI.DTOs.Product.Incoming_Data;
using happykopiAPI.DTOs.Product.Internal;
using happykopiAPI.DTOs.Product.Outgoing_Data;
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
        private readonly INotificationService _notificationService;
        public ProductService(IConfiguration configuration, INotificationService notificationService)
        {
            _configuration = configuration;
            _notificationService = notificationService;
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
            var connectionString = _configuration.GetConnectionString("LocalDB");
            await using var connection = new SqlConnection(connectionString);
            await connection.OpenAsync();

            await using var transaction = await connection.BeginTransactionAsync();

            try
            {
                var productParams = new
                {
                    productDto.Name,
                    productDto.Description,
                    productDto.ImageUrl,
                    productDto.ImagePublicId,
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
                        variant.SizeId,
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
                            ProductVariantId = newVariantId,
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
                            ProductVariantId = newVariantId,
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

                await _notificationService.NotifyProductsUpdatedAsync();
                await transaction.CommitAsync();

                return newProductId;
            }
            catch (Exception)
            {
                await transaction.RollbackAsync();
                throw; 
            }
        }

        public async Task<IEnumerable<ProductListItemDto>> GetActiveProductsAsync(int? categoryId)
        {
            using var connection = CreateConnection();
            var parameters = new { CategoryId = categoryId };
            return await connection.QueryAsync<ProductListItemDto>(
                "sp_GetActiveProducts",
                   parameters,
                commandType: CommandType.StoredProcedure);
        }

        public async Task<IEnumerable<ProductListItemDto>> GetInactiveProductsAsync(int? categoryId)
        {
            using var connection = CreateConnection();
            var parameters = new { CategoryId = categoryId };
            return await connection.QueryAsync<ProductListItemDto>(
                "sp_GetInactiveProducts",
                parameters,
                commandType: CommandType.StoredProcedure);
        }

        public async Task<ProductDetailDto> GetProductDetailByIdAsync(int productId)
        {
            using var connection = CreateConnection();
            var parameters = new { ProductId = productId };

            using var multi = await connection.QueryMultipleAsync("sp_GetProductDetailById", parameters, commandType: CommandType.StoredProcedure);

            var product = await multi.ReadSingleOrDefaultAsync<ProductDetailDto>();
            if (product == null) return null;

            var variants = (await multi.ReadAsync<ProductVariantDetailDto>()).ToList();
            var ingredients = (await multi.ReadAsync<ProductVariantIngredientDetailDto>()).ToList();
            var addOns = (await multi.ReadAsync<ProductVariantAddOnDetailDto>()).ToList();

            var variantIngredients = ingredients.ToLookup(i => i.ProductVariantId);
            var variantAddOns = addOns.ToLookup(a => a.ProductVariantId);

            foreach (var variant in variants)
            {
                variant.Recipe = variantIngredients[variant.Id].ToList();
                variant.AddOns = variantAddOns[variant.Id].ToList();
            }
            product.Variants = variants;

            return product;
        }

        public async Task UpdateProductAsync(int productId, ProductUpdateDto productDto)
        {
            var connectionString = _configuration.GetConnectionString("LocalDB");
            await using var connection = new SqlConnection(connectionString);
            await connection.OpenAsync();

            await using var transaction = await connection.BeginTransactionAsync();

            try
            {
                var productParams = new
                {
                    ProductId = productId,
                    productDto.Name,
                    productDto.Description,
                    productDto.ImageUrl,
                    productDto.ImagePublicId,
                    productDto.CategoryId,
                    productDto.IsAvailable,
                    productDto.IsActive
                };

                await connection.ExecuteAsync(
                    "sp_UpdateProductMain",
                    productParams,
                    transaction: transaction,
                    commandType: CommandType.StoredProcedure
                );

                foreach (var variant in productDto.Variants)
                {
                    var variantParams = new
                    {
                        ProductId = productId,
                        variant.SizeId,
                        variant.Price
                    };
                    int newVariantId = await connection.QuerySingleAsync<int>(
                        "sp_CreateProductVariant",
                        variantParams,
                        transaction: transaction,
                        commandType: CommandType.StoredProcedure
                    );

                    foreach (var ingredient in variant.Recipe)
                    {
                        await connection.ExecuteAsync("sp_CreateVariantIngredient", new { ProductVariantId = newVariantId, ingredient.StockItemId, ingredient.QuantityNeeded }, transaction: transaction, commandType: CommandType.StoredProcedure);
                    }

                    foreach (var addOn in variant.AddOns)
                    {
                        await connection.ExecuteAsync("sp_CreateVariantAddOn", new { ProductVariantId = newVariantId, addOn.ModifierId, addOn.DefaultQuantity }, transaction: transaction, commandType: CommandType.StoredProcedure);
                    }
                }

                await transaction.CommitAsync();
            }
            catch (Exception)
            {
                await transaction.RollbackAsync();
                throw;
            }
        }

        public async Task DeleteProductAsync(int productId)
        {
            using var connection = CreateConnection();
            var parameters = new { ProductId = productId };
            await connection.ExecuteAsync("sp_DeleteProduct", parameters, commandType: CommandType.StoredProcedure);
            await _notificationService.NotifyProductsUpdatedAsync();
        }

        public async Task<bool> RestoreProductAsync(int productId)
        {
            using var connection = CreateConnection();
            var parameters = new { ProductId = productId };
            var rowsAffected = await connection.ExecuteAsync("sp_RestoreProduct", parameters, commandType: CommandType.StoredProcedure);

            if (rowsAffected > 0)
            {
                await _notificationService.NotifyProductsUpdatedAsync();
            }

            return rowsAffected > 0;
        }
    }
}
