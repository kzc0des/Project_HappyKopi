using happykopiAPI.DTOs.Inventory;
using happykopiAPI.DTOs.Inventory.Outgoing_Data;
using happykopiAPI.Enums;

namespace happykopiAPI.Services.Interfaces
{
    public interface IStockItemService
    {
        Task AddNewStockItemAsync(StockItemForCreateDto stockItemDto);
        Task AddStockItemBatchAsync(StockItemBatchForCreateDto batchDto);
        Task<IEnumerable<StockItemSummaryDto>> GetAllStockItemsAsync();
        Task<StockItemDetailsDto> GetStockItemByIdAsync(int id);
        Task<IEnumerable<StockItemBatchDetailsDto>> GetBatchesByStockItemIdAsync(int stockItemId);
        Task<IEnumerable<LowStockItemDto>> GetLowStockItemsAsync();
        Task<IEnumerable<StockItemTypeCountDto>> GetStockItemCountByItemTypeAsync();
        Task<IEnumerable<StockItemSummaryDto>> GetStockItemsByItemTypeAsync(StockItemType itemType);
        Task UpdateStockItemAsync(int id, StockItemUpdateDto stockItemDto);
        Task AdjustStockQuantityAsync(StockAdjustmentDto adjustmentDto);
        Task DeactivateStockItemAsync(int id, int userId);
    }
}
