using Dapper;
using happykopiAPI.Services.Interfaces;
using Microsoft.Data.SqlClient;
using System.Data;
using happykopiAPI.DTOs.Order.Outgoing_Data;
using happykopiAPI.DTOs.Product.Outgoing_Data;
using happykopiAPI.DTOs.Modifier.Internal;
using happykopiAPI.Enums;

namespace happykopiAPI.Services.Implementations
{
    public class OrderService : IOrderService
    {
        private readonly IConfiguration _configuration;

        public OrderService(IConfiguration configuration)
        {
            _configuration = configuration;
        }
        private IDbConnection CreateConnection() => new SqlConnection(_configuration.GetConnectionString("LocalDB"));

        public async Task<IEnumerable<CategoryWithProductCountDto>> GetCategoriesWithProductCountAsync()
        {
            using var connection = CreateConnection();
            return await connection.QueryAsync<CategoryWithProductCountDto>(
                "dbo.sp_GetCategoriesWithProductCount",
                commandType: CommandType.StoredProcedure);
        }

        public async Task<IEnumerable<ProductsWithCategoryDto>> GetProductsWithCategoriesAsync(int categoryId)
        {
            using var connection = CreateConnection();

            return await connection.QueryAsync<ProductsWithCategoryDto>(
                "dbo.sp_GetProductsWithCategoryOf",
                new { CategoryId = categoryId },
                commandType: CommandType.StoredProcedure
            );
        }

        public async Task<IEnumerable<ModifierCountDto>> GetModifierCountByTypeAsync()
        {
            using var connection = CreateConnection();
            var resultsFromDb = await connection.QueryAsync<ModifierCountFromDbDto>(
                "sp_GetModifierCountByType",
                commandType: CommandType.StoredProcedure
            );

            var result = resultsFromDb
                .Select(r => new ModifierCountDto
                {
                    ModifierType = ((ModifierType)r.ModifierType).ToString(),
                    ModifierCount = r.ModifierCount
                })
                .ToList();


            return result;
        }

        public async Task<IEnumerable<OrderModifierSummaryDto>> GetModifiersByTypeAsync(ModifierType modifierType)
        {
            using var connection = CreateConnection();
            var parameters = new { ModifierType = (int)modifierType };
            return await connection.QueryAsync<OrderModifierSummaryDto>("sp_GetModifiersByType", parameters, commandType: CommandType.StoredProcedure);
        }

        public async Task<IEnumerable<OrderModifierSummaryDto>> GetAllModifiersAsync()
        {
            using var connection = CreateConnection();

            return await connection.QueryAsync<OrderModifierSummaryDto>("sp_GetModifiers", commandType: CommandType.StoredProcedure);
        }

        public async Task<IEnumerable<OrderModifierSummaryDto>> GetAvailableModifiersAsync()
        {
            using var connection = CreateConnection();

            return await connection.QueryAsync<OrderModifierSummaryDto>("sp_GetAvailableModifiers", commandType: CommandType.StoredProcedure);
        }

        public async Task<ProductConfigurationResultDto> GetProductConfigurationByIdAsync(int productId)
        {
            using var connection = CreateConnection();
             
            var parameters = new { p_ProductId = productId };
             
            using var multi = await connection.QueryMultipleAsync(
                "GetProductConfigurationByProductId",
                parameters,
                commandType: CommandType.StoredProcedure
            );
             
            var result = new ProductConfigurationResultDto
            {
                // 1. First result set: Product Variants
                Variants = (await multi.ReadAsync<OrderVariantDto>()).ToList(),
                 
                Ingredients = (await multi.ReadAsync<OrderVariantIngredientDto>()).ToList(),
                 
                AddOns = (await multi.ReadAsync<OrderVarianAddontDto>()).ToList()
            };

            return result;
        }
    }
}