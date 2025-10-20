using AutoMapper;
using Dapper;
using happykopiAPI.DTOs.Modifier.Incoming_Data;
using happykopiAPI.DTOs.Modifier.Outgoing_Data;
using happykopiAPI.Models;
using happykopiAPI.Services.Interfaces;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Data.SqlClient;
using System.Configuration;
using System.Data;
using System.Text.Json;

namespace happykopiAPI.Services.Implementations
{
    public class ModifierService : IModifierService
    {
        private readonly INotificationService _notificationService; 
        private readonly IMapper _mapper;
        private readonly string _connectionString;
        public ModifierService(
            IConfiguration configuration, 
            INotificationService notificationService, 
            IMapper mapper
        )
        {
            _connectionString = configuration.GetConnectionString("LocalDB");
            _notificationService = notificationService;
            _mapper = mapper;
        }

        public async Task<IEnumerable<ModifierSummaryDto>> GetAllModifiersAsync()
        {
            using var connection = new SqlConnection(_connectionString);
            var modifiers = await connection.QueryAsync<Modifier>("sp_GetModifiers", commandType: CommandType.StoredProcedure);
            return _mapper.Map<IEnumerable<ModifierSummaryDto>>(modifiers);
        }

        public async Task<IEnumerable<ModifierSummaryDto>> GetAvailableModifiersAsync()
        {
            using var connection = new SqlConnection(_connectionString);
            var modifiers = await connection.QueryAsync<Modifier>("sp_GetAvailableModifiers", commandType: CommandType.StoredProcedure);
            return _mapper.Map<IEnumerable<ModifierSummaryDto>>(modifiers);
        }

        public async Task<ModifierSummaryDto> CreateModifierAsync(ModifierForCreateDto dto)
        {
            var parameters = new DynamicParameters();
            parameters.Add("Name", dto.Name, DbType.String);
            parameters.Add("Price", dto.Price, DbType.Decimal);
            parameters.Add("IsAvailable", true, DbType.Boolean);
            parameters.Add("Type", dto.Type.ToString(), DbType.String);

            using var connection = new SqlConnection(_connectionString);
            var newId = await connection.QuerySingleAsync<int>("sp_AddNewModifier", parameters, commandType: CommandType.StoredProcedure);

            var newModifier = _mapper.Map<ModifierSummaryDto>(dto);
            newModifier.Id = newId;
            newModifier.IsAvailable = true;

            await _notificationService.NotifyModifiersUpdatedAsync();
            return newModifier;
        }

        public async Task<bool> UpdateModifierAsync(int modifierId, ModifierForUpdateDto dto)
        {
            var parameters = _mapper.Map<DynamicParameters>(dto);
            parameters.Add("ModifierId", modifierId, DbType.Int32);
            parameters.Add("Type", dto.Type.ToString(), DbType.String);

            using var connection = new SqlConnection(_connectionString);
            var affectedRows = await connection.ExecuteAsync("sp_UpdateModifier", parameters, commandType: CommandType.StoredProcedure);
            if (affectedRows > 0)
            {
                await _notificationService.NotifyModifiersUpdatedAsync();
                return true;
            }
            return false;
        }

        public async Task<bool> LinkStockItemAsync(int modifierId, ModifierStockItemLinkDto dto)
        {
            var parameters = new DynamicParameters();
            parameters.Add("ModifierId", modifierId, DbType.Int32);
            parameters.Add("StockItemId", dto.StockItemId, DbType.Int32);
            parameters.Add("QuantityNeeded", dto.QuantityNeeded, DbType.Decimal);

            using var connection = new SqlConnection(_connectionString);
            await connection.ExecuteAsync("sp_LinkModifierToStockItem", parameters, commandType: CommandType.StoredProcedure);
            return true;
        }

        public async Task<bool> UnlinkStockItemAsync(int modifierId, int stockItemId)
        {
            var parameters = new DynamicParameters();
            parameters.Add("ModifierId", modifierId, DbType.Int32);
            parameters.Add("StockItemId", stockItemId, DbType.Int32);

            using var connection = new SqlConnection(_connectionString);
            await connection.ExecuteAsync("sp_UnlinkModifierFromStockItem", parameters, commandType: CommandType.StoredProcedure);
            return true;
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
    }
}
