using Dapper;
using happykopiAPI.DTOs.Modifier.Incoming_Data;
using happykopiAPI.DTOs.Modifier.Outgoing_Data;
using happykopiAPI.Enums;
using happykopiAPI.Services.Interfaces;
using Microsoft.Data.SqlClient;
using System.Data;
using System.Text.Json;

namespace happykopiAPI.Services.Implementations
{
    public class ModifierService : IModifierService
    {
        private readonly INotificationService _notificationService;
        private readonly string _connectionString;

        public ModifierService(
            IConfiguration configuration,
            INotificationService notificationService
        )
        {
            _connectionString = configuration.GetConnectionString("LocalDB");
            _notificationService = notificationService;
        }

        public async Task<IEnumerable<ModifierCountDto>> GetModifierCountByTypeAsync()
        {
            using var connection = new SqlConnection(_connectionString);
            var result = await connection.QueryAsync<ModifierCountDto>(
                "sp_GetModifierCountByType",
                commandType: CommandType.StoredProcedure
            );
            return result;
        }

        public async Task<IEnumerable<ModifierSummaryDto>> GetAllModifiersAsync()
        {
            using var connection = new SqlConnection(_connectionString);

            return await connection.QueryAsync<ModifierSummaryDto>("sp_GetModifiers", commandType: CommandType.StoredProcedure);
        }

        public async Task<IEnumerable<ModifierSummaryDto>> GetInactiveModifiersAsync()
        {
            using var connection = new SqlConnection(_connectionString);
            return await connection.QueryAsync<ModifierSummaryDto>("sp_GetInactiveModifiers", commandType: CommandType.StoredProcedure);
        }

        // order process query only available modifiers
        public async Task<IEnumerable<ModifierSummaryDto>> GetAvailableModifiersAsync()
        {
            using var connection = new SqlConnection(_connectionString);

            return await connection.QueryAsync<ModifierSummaryDto>("sp_GetAvailableModifiers", commandType: CommandType.StoredProcedure);
        }

        public async Task<IEnumerable<ModifierSummaryDto>> GetModifiersByTypeAsync(ModifierType modifierType)
        {
            using var connection = new SqlConnection(_connectionString);
            var parameters = new { ModifierType = (int)modifierType };
            return await connection.QueryAsync<ModifierSummaryDto>("sp_GetModifiersByType", parameters, commandType: CommandType.StoredProcedure);
        }
        public async Task<ModifierDetailsDto> GetModifierByIdAsync(int modifierId)
        {
            await using var connection = new SqlConnection(_connectionString);

            var parameters = new { ModifierId = modifierId };

            var jsonResult = await connection.ExecuteScalarAsync<string>(
                "sp_GetModifierById",
                parameters,
                commandType: CommandType.StoredProcedure
            );

            if (string.IsNullOrEmpty(jsonResult))
            {
                return null;
            }

            var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
            return JsonSerializer.Deserialize<ModifierDetailsDto>(jsonResult, options);
        }
        public async Task<ModifierSummaryDto> CreateModifierAsync(ModifierForCreateDto dto)
        {
            var parameters = new
            {
                dto.Name,
                dto.Price,
                dto.OzAmount,
                IsAvailable = true, 
                Type = dto.Type,
                IsActive = true
            };

            using var connection = new SqlConnection(_connectionString);
            var newId = await connection.QuerySingleAsync<int>("sp_AddNewModifier", parameters, commandType: CommandType.StoredProcedure);

            var newModifier = new ModifierSummaryDto
            {
                Id = newId,
                Name = dto.Name,
                Price = dto.Price
            };

            await _notificationService.NotifyModifiersUpdatedAsync();
            return newModifier;
        }

        public async Task<bool> UpdateModifierAsync(int modifierId, ModifierForUpdateDto dto)
        {
            var parameters = new
            {
                ModifierId = modifierId,
                dto.Name,
                dto.Price,
                dto.OzAmount,
                Type = dto.Type,
                dto.IsAvailable
            };

            using var connection = new SqlConnection(_connectionString);
            var affectedRows = await connection.ExecuteAsync("sp_UpdateModifier", parameters, commandType: CommandType.StoredProcedure);

            if (affectedRows > 0)
            {
                await _notificationService.NotifyModifiersUpdatedAsync();
                return true;
            }
            return false;
        }

        public async Task<bool> DeleteModifierAsync(int modifierId)
        {
            var parameters = new { ModifierId = modifierId };

            using var connection = new SqlConnection(_connectionString);
            var affectedRows = await connection.ExecuteAsync("sp_DeleteModifier", parameters, commandType: CommandType.StoredProcedure);

            if (affectedRows > 0)
            {
                await _notificationService.NotifyModifiersUpdatedAsync();
                return true;
            }
            return false;
        }

        public async Task<bool> LinkStockItemAsync(int modifierId, ModifierStockItemLinkDto dto)
        {
            var parameters = new
            {
                ModifierId = modifierId,
                dto.StockItemId,
                dto.QuantityNeeded
            };

            using var connection = new SqlConnection(_connectionString);
            await connection.ExecuteAsync("sp_LinkModifierToStockItem", parameters, commandType: CommandType.StoredProcedure);
            return true;
        }

        public async Task<bool> UnlinkStockItemAsync(int modifierId, int stockItemId)
        {
            var parameters = new
            {
                ModifierId = modifierId,
                StockItemId = stockItemId
            };

            using var connection = new SqlConnection(_connectionString);
            await connection.ExecuteAsync("sp_UnlinkModifierFromStockItem", parameters, commandType: CommandType.StoredProcedure);
            return true;
        }
    }
}