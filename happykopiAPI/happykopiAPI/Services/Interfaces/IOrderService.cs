using happykopiAPI.DTOs.Order.Ingoing_Data;
using happykopiAPI.DTOs.Order.Outgoing_Data;
using happykopiAPI.DTOs.Product.Outgoing_Data;
using happykopiAPI.Enums;

namespace happykopiAPI.Services.Interfaces
{
    public interface IOrderService
    {
        // NEW METHOD
        Task<NewOrderResponseDto> CreateOrderAsync(NewOrderRequestDto request);

        // EXISTING METHODS
        Task<IEnumerable<CategoryWithProductCountDto>> GetCategoriesWithProductCountAsync();
        Task<IEnumerable<ProductsWithCategoryDto>> GetProductsWithCategoriesAsync(int categoryId);
        Task<IEnumerable<ModifierCountDto>> GetModifierCountByTypeAsync();
        Task<IEnumerable<OrderModifierSummaryDto>> GetModifiersByTypeAsync(ModifierType modifierType);
        Task<IEnumerable<OrderModifierSummaryDto>> GetAvailableModifiersAsync();
        Task<IEnumerable<OrderModifierSummaryDto>> GetAllModifiersAsync();
        Task<ProductConfigurationResultDto> GetProductConfigurationByIdAsync(int productId);
    }
}