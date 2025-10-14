using happykopiAPI.DTOs.Inventory;
using happykopiAPI.DTOs.Inventory.Outgoing_Data;
using happykopiAPI.Services.Interfaces;
using Microsoft.Data.SqlClient;
using System.Data;

namespace happykopiAPI.Services.Implementations
{
    public class StockItemService : IStockItemService
    {
        private readonly string _connectionString;
        public StockItemService(IConfiguration config) {
            _connectionString = config.GetConnectionString("LocalDB");
        }

        public async Task AddNewStockItemAsync(StockItemForCreateDto dto)
        {
            await using var connection = new SqlConnection(_connectionString);
            await using var command = new SqlCommand("sp_AddNewStockItem", connection);

            command.CommandType = CommandType.StoredProcedure;
            command.Parameters.AddWithValue("@Name", dto.Name);
            command.Parameters.AddWithValue("@Unit", dto.Unit);
            command.Parameters.AddWithValue("@AlertLevel", dto.AlertLevel);
            command.Parameters.AddWithValue("@IsPerishable", dto.IsPerishable);
            command.Parameters.AddWithValue("@ItemType", dto.ItemType);
            command.Parameters.AddWithValue("@InitialStockQuantity", dto.InitialStockQuantity);
            command.Parameters.AddWithValue("@ExpiryDate", (object)dto.ExpiryDate ?? DBNull.Value);
            command.Parameters.AddWithValue("@UserId", dto.UserId);

            await connection.OpenAsync();
            await command.ExecuteNonQueryAsync();
        }

        public async Task AddStockItemBatchAsync(StockItemBatchForCreateDto dto)
        {
            await using var connection = new SqlConnection(_connectionString);
            await using var command = new SqlCommand("sp_AddStockItemBatch", connection);

            command.CommandType = CommandType.StoredProcedure;
            command.Parameters.AddWithValue("@StockItemId", dto.StockItemId);
            command.Parameters.AddWithValue("@QuantityAdded", dto.QuantityAdded);
            command.Parameters.AddWithValue("@UserId", dto.UserId);
            command.Parameters.AddWithValue("@ExpiryDate", (object)dto.ExpiryDate ?? DBNull.Value);
            command.Parameters.AddWithValue("@Remarks", (object)dto.Remarks ?? DBNull.Value);

            await connection.OpenAsync();
            await command.ExecuteNonQueryAsync();
        }

        // === READ / GET METHODS ===

        public async Task<IEnumerable<StockItemSummaryDto>> GetAllStockItemsAsync()
        {
            var stockItems = new List<StockItemSummaryDto>();
            await using var connection = new SqlConnection(_connectionString);
            await using var command = new SqlCommand("sp_GetAllStockItems", connection);
            command.CommandType = CommandType.StoredProcedure;

            await connection.OpenAsync();
            await using var reader = await command.ExecuteReaderAsync();

            while (await reader.ReadAsync())
            {
                stockItems.Add(new StockItemSummaryDto
                {
                    Id = reader.GetInt32("Id"),
                    Name = reader.GetString("Name"),
                    UnitOfMeasure = reader.GetString("UnitOfMeasure"),
                    AlertLevel = reader.GetDecimal("AlertLevel"),
                    TotalStockQuantity = reader.GetDecimal("TotalStockQuantity"),
                    IsActive = reader.GetBoolean("IsActive"),
                    BatchCount = reader.GetInt32("BatchCount")
                });
            }
            return stockItems;
        }

        public async Task<StockItemDetailsDto> GetStockItemByIdAsync(int id)
        {
            await using var connection = new SqlConnection(_connectionString);
            await using var command = new SqlCommand("sp_GetStockItemById", connection);
            command.CommandType = CommandType.StoredProcedure;
            command.Parameters.AddWithValue("@StockItemId", id);

            await connection.OpenAsync();
            await using var reader = await command.ExecuteReaderAsync();

            if (await reader.ReadAsync())
            {
                return new StockItemDetailsDto
                {
                    Id = reader.GetInt32("Id"),
                    Name = reader.GetString("Name"),
                    UnitOfMeasure = reader.GetString("UnitOfMeasure"),
                    AlertLevel = reader.GetDecimal("AlertLevel"),
                    IsPerishable = reader.GetBoolean("IsPerishable"),
                    ItemType = reader.GetInt32("ItemType"),
                    IsActive = reader.GetBoolean("IsActive"),
                    TotalStockQuantity = reader.GetDecimal("TotalStockQuantity"),
                    BatchCount = reader.GetInt32("BatchCount")
                };
            }
            return null;
        }

        public async Task<IEnumerable<StockItemBatchDetailsDto>> GetBatchesByStockItemIdAsync(int stockItemId)
        {
            var batches = new List<StockItemBatchDetailsDto>();
            await using var connection = new SqlConnection(_connectionString);
            await using var command = new SqlCommand("sp_GetBatchesByStockItemId", connection);
            command.CommandType = CommandType.StoredProcedure;
            command.Parameters.AddWithValue("@StockItemId", stockItemId);

            await connection.OpenAsync();
            await using var reader = await command.ExecuteReaderAsync();

            while (await reader.ReadAsync())
            {
                batches.Add(new StockItemBatchDetailsDto
                {
                    Id = reader.GetInt32("Id"),
                    StockQuantity = reader.GetDecimal("StockQuantity"),
                    ExpiryDate = reader.IsDBNull("ExpiryDate") ? (DateTime?)null : reader.GetDateTime("ExpiryDate")
                });
            }
            return batches;
        }

        public async Task<IEnumerable<LowStockItemDto>> GetLowStockItemsAsync()
        {
            var lowStockItems = new List<LowStockItemDto>();
            await using var connection = new SqlConnection(_connectionString);
            await using var command = new SqlCommand("sp_GetLowStockItems", connection);
            command.CommandType = CommandType.StoredProcedure;

            await connection.OpenAsync();
            await using var reader = await command.ExecuteReaderAsync();

            while (await reader.ReadAsync())
            {
                lowStockItems.Add(new LowStockItemDto
                {
                    Id = reader.GetInt32("Id"),
                    Name = reader.GetString("Name"),
                    UnitOfMeasure = reader.GetString("UnitOfMeasure"),
                    TotalStockQuantity = reader.GetDecimal("TotalStockQuantity"),
                    AlertLevel = reader.GetDecimal("AlertLevel")
                });
            }
            return lowStockItems;
        }

        public async Task<IEnumerable<StockItemTypeCountDto>> GetStockItemCountByItemTypeAsync()
        {
            var counts = new List<StockItemTypeCountDto>();
            await using var connection = new SqlConnection(_connectionString);
            await using var command = new SqlCommand("sp_GetStockItemCountByItemType", connection);

            command.CommandType = CommandType.StoredProcedure;

            await connection.OpenAsync();
            await using var reader = await command.ExecuteReaderAsync();

            while (await reader.ReadAsync())
            {
                counts.Add(new StockItemTypeCountDto
                {
                    ItemTypeName = reader.GetString("ItemTypeName"),
                    StockItemCount = reader.GetInt32("StockItemCount")
                });
            }
            return counts;
        }

        // === UPDATE METHODS ===

        public async Task UpdateStockItemAsync(int id, StockItemUpdateDto dto)
        {
            await using var connection = new SqlConnection(_connectionString);
            await using var command = new SqlCommand("sp_UpdateStockItem", connection);

            command.CommandType = CommandType.StoredProcedure;
            command.Parameters.AddWithValue("@StockItemId", id);
            command.Parameters.AddWithValue("@Name", dto.Name);
            command.Parameters.AddWithValue("@Unit", dto.Unit);
            command.Parameters.AddWithValue("@AlertLevel", dto.AlertLevel);
            command.Parameters.AddWithValue("@IsPerishable", dto.IsPerishable);
            command.Parameters.AddWithValue("@ItemType", dto.ItemType);
            command.Parameters.AddWithValue("@UserId", dto.UserId);

            await connection.OpenAsync();
            await command.ExecuteNonQueryAsync();
        }

        public async Task AdjustStockQuantityAsync(StockAdjustmentDto dto)
        {
            await using var connection = new SqlConnection(_connectionString);
            await using var command = new SqlCommand("sp_AdjustStockQuantity", connection);

            command.CommandType = CommandType.StoredProcedure;
            command.Parameters.AddWithValue("@StockItemBatchId", dto.StockItemBatchId);
            command.Parameters.AddWithValue("@NewQuantity", dto.NewQuantity);
            command.Parameters.AddWithValue("@UserId", dto.UserId);
            command.Parameters.AddWithValue("@Remarks", dto.Remarks);

            await connection.OpenAsync();
            await command.ExecuteNonQueryAsync();
        }

        // === DELETE (SOFT) METHOD ===

        public async Task DeactivateStockItemAsync(int id, int userId)
        {
            await using var connection = new SqlConnection(_connectionString);
            await using var command = new SqlCommand("sp_DeactivateStockItem", connection);

            command.CommandType = CommandType.StoredProcedure;
            command.Parameters.AddWithValue("@StockItemId", id);
            command.Parameters.AddWithValue("@UserId", userId);

            await connection.OpenAsync();
            await command.ExecuteNonQueryAsync();
        }
    }
}
