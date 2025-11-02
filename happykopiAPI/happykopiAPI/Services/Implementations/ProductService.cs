using Dapper;
using happykopiAPI.DTOs.Product.Dropdown_Data;
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
    }
}
