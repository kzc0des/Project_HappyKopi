using happykopiAPI.DTOs.Product.Dropdown_Data;
using happykopiAPI.DTOs.Product.Incoming_Data;
using happykopiAPI.DTOs.Product.Outgoing_Data;

namespace happykopiAPI.Services.Interfaces
{
    public interface IProductService
    {
        Task<IEnumerable<ModifierDto>> GetActiveSizesAsync();
        Task<IEnumerable<StockItemDto>> GetActiveLiquidAndPowderStockItemsAsync();
        Task<IEnumerable<ModifierDto>> GetActiveAddOnsAsync();
        Task<IEnumerable<CategoryDto>> GetAllDrinkCategoriesAsync();
        Task<int> CreateProductAsync(ProductCreateDto productDto);
        Task<IEnumerable<ProductListItemDto>> GetActiveProductsAsync();
        Task<ProductDetailDto> GetProductDetailByIdAsync(int productId);
        Task UpdateProductAsync(int productId, ProductUpdateDto productDto);
        Task DeleteProductAsync(int productId);
    }
}
