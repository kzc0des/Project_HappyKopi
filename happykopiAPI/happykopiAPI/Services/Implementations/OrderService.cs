using Dapper;
using happykopiAPI.Services.Interfaces;
using Microsoft.Data.SqlClient;
using System.Data;
using happykopiAPI.DTOs.Order.Outgoing_Data;
using happykopiAPI.DTOs.Product.Outgoing_Data;

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
    }
}