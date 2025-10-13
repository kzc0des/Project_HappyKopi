using happykopiAPI.DTOs.Inventory;
using happykopiAPI.DTOs.Inventory.Outgoing_Data;

namespace happykopiAPI.Services.Interfaces
{
    public interface IStockItemService
    {
        Task AddNewStockItemAsync(StockItemForCreateDto stockItemDto);
        Task AddStockItemBatchAsync(StockItemBatchForCreateDto batchDto);
        Task<StockItemDetailsDto> GetStockItemByIdAsync(int id);
        Task<IEnumerable<StockItemSummaryDto>> GetAllStockItemsAsync();
        Task<IEnumerable<LowStockItemDto>> GetLowStockItemsAsync();
        Task UpdateStockItemAsync(int id, StockItemUpdateDto stockItemDto);
        Task DeactivateStockItemAsync(int id, int userId);
        Task AdjustStockQuantityAsync(StockAdjustmentDto adjustmentDto);
        Task<IEnumerable<StockItemBatchDetailsDto>> GetBatchesByStockItemIdAsync(int stockItemId);
    }
}
