using happykopiAPI.DTOs.Product.Dropdown_Data;
using happykopiAPI.DTOs.Product.Incoming_Data;

namespace happykopiAPI.Services.Interfaces
{
    public interface IProductService
    {
        Task<IEnumerable<ModifierDto>> GetActiveSizesAsync();
        Task<IEnumerable<StockItemDto>> GetActiveLiquidAndPowderStockItemsAsync();
        Task<IEnumerable<ModifierDto>> GetActiveAddOnsAsync();
        Task<IEnumerable<CategoryDto>> GetAllDrinkCategoriesAsync();
        Task<int> CreateProductAsync(ProductCreateDto productDto);
    }
}
