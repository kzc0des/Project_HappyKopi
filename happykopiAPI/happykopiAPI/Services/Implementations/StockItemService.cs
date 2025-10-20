using Dapper;
using happykopiAPI.DTOs.Inventory;
using happykopiAPI.DTOs.Inventory.Outgoing_Data;
using happykopiAPI.Enums;
using happykopiAPI.Services.Interfaces;
using Microsoft.Data.SqlClient;
using System.Data;
using System.Text.Json; 

namespace happykopiAPI.Services.Implementations
{
    public class StockItemService : IStockItemService
    {
        private readonly string _connectionString;

        public StockItemService(IConfiguration config)
        {
            _connectionString = config.GetConnectionString("LocalDB");
        }

        public async Task AddNewStockItemAsync(StockItemForCreateDto dto)
        {
            await using var connection = new SqlConnection(_connectionString);

            var parameters = new DynamicParameters();
            parameters.Add("@Name", dto.Name);
            parameters.Add("@Unit", dto.Unit);
            parameters.Add("@AlertLevel", dto.AlertLevel);
            parameters.Add("@IsPerishable", dto.IsPerishable);
            parameters.Add("@ItemType", dto.ItemType);
            parameters.Add("@InitialStockQuantity", dto.InitialStockQuantity);
            parameters.Add("@ExpiryDate", dto.ExpiryDate); 
            parameters.Add("@UserId", dto.UserId);

            await connection.ExecuteAsync("sp_AddNewStockItem", parameters, commandType: CommandType.StoredProcedure);
        }

        public async Task AddStockItemBatchAsync(StockItemBatchForCreateDto dto)
        {
            await using var connection = new SqlConnection(_connectionString);

            var parameters = new DynamicParameters();
            parameters.Add("@StockItemId", dto.StockItemId);
            parameters.Add("@QuantityAdded", dto.QuantityAdded);
            parameters.Add("@UserId", dto.UserId);
            parameters.Add("@ExpiryDate", dto.ExpiryDate);
            parameters.Add("@Remarks", dto.Remarks);

            await connection.ExecuteAsync("sp_AddStockItemBatch", parameters, commandType: CommandType.StoredProcedure);
        }

        // === READ / GET METHODS ===

        public async Task<IEnumerable<StockItemSummaryDto>> GetAllStockItemsAsync()
        {
            await using var connection = new SqlConnection(_connectionString);
            return await connection.QueryAsync<StockItemSummaryDto>("sp_GetAllStockItems", commandType: CommandType.StoredProcedure);
        }

        public async Task<StockItemDetailsDto> GetStockItemByIdAsync(int id)
        {
            await using var connection = new SqlConnection(_connectionString);

            var parameters = new DynamicParameters();
            parameters.Add("@StockItemId", id);

            var jsonResult = await connection.ExecuteScalarAsync<string>("sp_GetStockItemById", parameters, commandType: CommandType.StoredProcedure);

            if (string.IsNullOrEmpty(jsonResult))
            {
                return null;
            }

            var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
            var resultDto = JsonSerializer.Deserialize<StockItemDetailsDto>(jsonResult, options);

            return resultDto;
        }

        public async Task<IEnumerable<StockItemBatchDetailsDto>> GetBatchesByStockItemIdAsync(int stockItemId)
        {
            await using var connection = new SqlConnection(_connectionString);

            var parameters = new DynamicParameters();
            parameters.Add("@StockItemId", stockItemId);

            return await connection.QueryAsync<StockItemBatchDetailsDto>("sp_GetBatchesByStockItemId", parameters, commandType: CommandType.StoredProcedure);
        }

        public async Task<IEnumerable<LowStockItemDto>> GetLowStockItemsAsync()
        {
            await using var connection = new SqlConnection(_connectionString);

            return await connection.QueryAsync<LowStockItemDto>("sp_GetLowStockItems", commandType: CommandType.StoredProcedure);
        }

        public async Task<IEnumerable<StockItemTypeCountDto>> GetStockItemCountByItemTypeAsync()
        {
            await using var connection = new SqlConnection(_connectionString);

            return await connection.QueryAsync<StockItemTypeCountDto>("sp_GetStockItemCountByItemType", commandType: CommandType.StoredProcedure);
        }

        public async Task<IEnumerable<StockItemSummaryDto>> GetStockItemsByItemTypeAsync(StockItemType itemType)
        {
            await using var connection = new SqlConnection(_connectionString);

            var parameters = new DynamicParameters();
            parameters.Add("@ItemType", itemType);

            return await connection.QueryAsync<StockItemSummaryDto>("sp_GetStockItemsByItemType", parameters, commandType: CommandType.StoredProcedure);
        }

        // === UPDATE METHODS ===

        public async Task UpdateStockItemAsync(int id, StockItemUpdateDto dto)
        {
            await using var connection = new SqlConnection(_connectionString);

            var parameters = new DynamicParameters();
            parameters.Add("@StockItemId", id);
            parameters.Add("@Name", dto.Name);
            parameters.Add("@Unit", dto.Unit);
            parameters.Add("@AlertLevel", dto.AlertLevel);
            parameters.Add("@IsPerishable", dto.IsPerishable);
            parameters.Add("@ItemType", dto.ItemType);
            parameters.Add("@UserId", dto.UserId);

            await connection.ExecuteAsync("sp_UpdateStockItem", parameters, commandType: CommandType.StoredProcedure);
        }

        public async Task AdjustStockQuantityAsync(StockAdjustmentDto dto)
        {
            await using var connection = new SqlConnection(_connectionString);

            var parameters = new DynamicParameters();
            parameters.Add("@StockItemBatchId", dto.StockItemBatchId);
            parameters.Add("@NewQuantity", dto.NewQuantity);
            parameters.Add("@UserId", dto.UserId);
            parameters.Add("@Remarks", dto.Remarks);

            await connection.ExecuteAsync("sp_AdjustStockQuantity", parameters, commandType: CommandType.StoredProcedure);
        }

        // === DELETE (SOFT) METHOD ===

        public async Task DeactivateStockItemAsync(int id, int userId)
        {
            await using var connection = new SqlConnection(_connectionString);

            var parameters = new DynamicParameters();
            parameters.Add("@StockItemId", id);
            parameters.Add("@UserId", userId);

            await connection.ExecuteAsync("sp_DeactivateStockItem", parameters, commandType: CommandType.StoredProcedure);
        }
    }
}