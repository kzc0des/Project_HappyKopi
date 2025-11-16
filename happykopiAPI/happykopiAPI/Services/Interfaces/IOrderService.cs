using happykopiAPI.DTOs.Order.Ingoing_Data;
using happykopiAPI.DTOs.Order.Outgoing_Data;
using happykopiAPI.DTOs.Product.Outgoing_Data;
using happykopiAPI.Enums;

namespace happykopiAPI.Services.Interfaces
{
    public interface IOrderService
    {
        Task<NewOrderResponseDto> CreateOrderAsync(NewOrderRequestDto request);
        Task<IEnumerable<ProductsWithCategoryDto>> GetProductsWithCategoriesAsync(int categoryId);
        Task<ProductConfigurationResultDto> GetProductConfigurationByIdAsync(int productId);
        Task<ProductAvailabilityResponseDto> GetProductAvailabilityAsync(int? categoryId = null);
        Task<IEnumerable<ModifierCountDto>> GetModifierCountByTypeAsync();
        Task<IEnumerable<OrderModifierSummaryDto>> GetModifiersByTypeAsync(ModifierType modifierType);
        Task<IEnumerable<OrderModifierSummaryDto>> GetAvailableModifiersAsync();
        Task<IEnumerable<OrderModifierSummaryDto>> GetAllModifiersAsync();

        /// <summary>
        /// All Refactored Methods Below
        /// </summary>
        /// 
        Task<IEnumerable<CategoryWithProductCountDto>> GetCategoriesWithProductCountAsync();
        Task<IEnumerable<ProductsWithCategoryDto>> GetAllProducts();

    }
}