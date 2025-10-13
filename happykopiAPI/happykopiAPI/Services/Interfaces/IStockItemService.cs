using happykopiAPI.DTOs.Inventory;

namespace happykopiAPI.Services.Interfaces
{
    public interface IStockItemService
    {
        Task<IEnumerable<StockItemDto>> GetAllStockItemsAsync();
        Task<StockItemDto> GetStockItemByIdAsync(int id);
        Task<StockItemDto> CreateStockItemAsync(StockItemForCreateDto stockItemForCreationDto);
        Task<StockItemDto> UpdateStockItemAsync(int id, StockItemForCreateDto stockItemForUpdateDto);
        Task<bool> DeleteStockItemAsync(int id);
    }
}
