using happykopiAPI.DTOs.Order.Outgoing_Data;
using happykopiAPI.DTOs.Product.Outgoing_Data;

namespace happykopiAPI.Services.Interfaces
{
    public interface IOrderService
    {
        public Task<IEnumerable<CategoryWithProductCountDto>> GetCategoriesWithProductCountAsync();
        public Task<IEnumerable<ProductsWithCategoryDto>> GetProductsWithCategoriesAsync(int categoryId);
    }
}
