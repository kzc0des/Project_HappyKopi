using happykopiAPI.DTOs.Category.Incoming_Data;
using happykopiAPI.DTOs.Category.Outgoing_Data;
using happykopiAPI.DTOs.Product;
using Microsoft.AspNetCore.Mvc;

namespace happykopiAPI.Services.Interfaces
{
    public interface ICategoryService
    {
        public Task CreateCategoryAsync([FromBody] CategoryForCreateUpdateDto categoryDto);
        public Task<bool> DeleteCategoryAsync(int id);
        public Task<IEnumerable<CategoryWithProductCountDto>> GetCategoriesWithProductCountAsync();
        public Task<CategoryWithProductCountDto> GetCategoryByIdAsync(int id);
        public Task UpdateCategoryAsync(int id, CategoryForCreateUpdateDto categoryDto);
    }
}
