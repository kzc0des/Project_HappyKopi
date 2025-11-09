using Dapper;
using happykopiAPI.Services.Interfaces;
using Microsoft.Data.SqlClient;
using System.Data;
using happykopiAPI.DTOs.Order.Outgoing_Data;

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
    }
}