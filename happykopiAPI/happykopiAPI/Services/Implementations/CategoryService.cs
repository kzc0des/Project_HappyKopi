using Dapper; 
using happykopiAPI.DTOs.Category.Incoming_Data;
using happykopiAPI.DTOs.Category.Outgoing_Data;
using happykopiAPI.DTOs.Product;
using happykopiAPI.Models;
using happykopiAPI.Services.Interfaces;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using System.Data;

namespace happykopiAPI.Services.Implementations
{
    public class CategoryService : ICategoryService
    {
        private readonly IConfiguration _configuration;

        public CategoryService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        private IDbConnection CreateConnection() => new SqlConnection(_configuration.GetConnectionString("LocalDB"));

        public async Task CreateCategoryAsync([FromBody] CategoryForCreateUpdateDto categoryDto)
        {
            using var connection = CreateConnection();

            var parameters = new { CategoryName = categoryDto.Name };
            var newCategoryId = await connection.ExecuteAsync(
                "dbo.sp_CreateCategory",
                parameters,
                commandType: CommandType.StoredProcedure);

        }

        public async Task<bool> DeleteCategoryAsync(int id)
        {
            using var connection = CreateConnection();
            var parameters = new { CategoryId = id };
            var rowsAffected = await connection.ExecuteAsync(
                "dbo.sp_DeleteCategory",
                parameters,
                commandType: CommandType.StoredProcedure);

            return rowsAffected > 0;
        }

        public async Task<IEnumerable<CategoryWithProductCountDto>> GetCategoriesWithProductCountAsync()
        {
            using var connection = CreateConnection();
            return await connection.QueryAsync<CategoryWithProductCountDto>(
                "dbo.sp_GetCategoriesWithProductCount",
                commandType: CommandType.StoredProcedure);
        }

        public async Task<IEnumerable<ProductWithCategoryNameDto>> GetActiveProductsByCategoryIdAsync(int categoryId)
        {
            using var connection = CreateConnection();
            var parameters = new { CategoryId = categoryId };
            return await connection.QueryAsync<ProductWithCategoryNameDto>(
                "dbo.sp_GetActiveProductsByCategoryId",
                parameters,
                commandType: CommandType.StoredProcedure);
        }

        public async Task<CategoryWithProductCountDto> GetCategoryByIdAsync(int id)
        {
            using var connection = CreateConnection();
            var parameters = new { CategoryId = id };
            return await connection.QuerySingleOrDefaultAsync<CategoryWithProductCountDto>(
                "dbo.sp_GetCategoryWithProductCountById",
                parameters,
                commandType: CommandType.StoredProcedure);
        }

        public async Task UpdateCategoryAsync(int id, CategoryForCreateUpdateDto categoryDto)
        {
            using var connection = CreateConnection();
            var parameters = new
            {
                CategoryId = id,
                CategoryName = categoryDto.Name
            };

            await connection.ExecuteAsync(
                "dbo.sp_UpdateCategory",
                parameters,
                commandType: CommandType.StoredProcedure);

        }
    }
}