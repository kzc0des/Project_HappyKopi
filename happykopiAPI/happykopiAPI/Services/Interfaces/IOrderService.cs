using happykopiAPI.DTOs.Order.Outgoing_Data;
using happykopiAPI.DTOs.Product.Outgoing_Data;
using happykopiAPI.Enums;

namespace happykopiAPI.Services.Interfaces
{
    public interface IOrderService
    {
        public Task<IEnumerable<CategoryWithProductCountDto>> GetCategoriesWithProductCountAsync();
        public Task<IEnumerable<ProductsWithCategoryDto>> GetProductsWithCategoriesAsync(int categoryId);
        Task<IEnumerable<ModifierCountDto>> GetModifierCountByTypeAsync();
        Task<IEnumerable<OrderModifierSummaryDto>> GetModifiersByTypeAsync(ModifierType modifierType);
        Task<IEnumerable<OrderModifierSummaryDto>> GetAvailableModifiersAsync();
        Task<IEnumerable<OrderModifierSummaryDto>> GetAllModifiersAsync();
    }
}
