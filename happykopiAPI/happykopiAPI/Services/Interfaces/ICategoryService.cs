using happykopiAPI.DTOs.Category.Incoming_Data;
using happykopiAPI.DTOs.Category.Outgoing_Data;
using happykopiAPI.DTOs.Product;

namespace happykopiAPI.Services.Interfaces
{
    public interface ICategoryService
    {
        Task<CategoryDto> GetCategoryByIdAsync(int id);
        Task<CategoryDto> CreateCategoryAsync(CategoryForCreateUpdateDto categoryDto);
        Task<CategoryDto> UpdateCategoryAsync(int id, CategoryForCreateUpdateDto categoryDto);
        Task<bool> DeleteCategoryAsync(int id);
        Task<IEnumerable<CategoryWithProductCountDto>> GetCategoriesWithProductCountAsync();
    }
}
