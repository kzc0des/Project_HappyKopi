using happykopiAPI.DTOs.Order.Ingoing_Data;
using happykopiAPI.DTOs.Order.Outgoing_Data;
using happykopiAPI.DTOs.Product.Outgoing_Data;
using happykopiAPI.Enums;

namespace happykopiAPI.Services.Interfaces
{
    public interface IOrderService
    {
        // ORDER METHODS
        Task<NewOrderResponseDto> CreateOrderAsync(NewOrderRequestDto request);

        // CATEGORY & PRODUCT METHODS
        Task<IEnumerable<CategoryWithProductCountDto>> GetCategoriesWithProductCountAsync();
        Task<IEnumerable<ProductsWithCategoryDto>> GetProductsWithCategoriesAsync(int categoryId);
        Task<ProductConfigurationResultDto> GetProductConfigurationByIdAsync(int productId);

        // NEW: PRODUCT AVAILABILITY METHOD
        Task<ProductAvailabilityResponseDto> GetProductAvailabilityAsync(int? categoryId = null);

        // MODIFIER METHODS
        Task<IEnumerable<ModifierCountDto>> GetModifierCountByTypeAsync();
        Task<IEnumerable<OrderModifierSummaryDto>> GetModifiersByTypeAsync(ModifierType modifierType);
        Task<IEnumerable<OrderModifierSummaryDto>> GetAvailableModifiersAsync();
        Task<IEnumerable<OrderModifierSummaryDto>> GetAllModifiersAsync();
    }
}