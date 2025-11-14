using Dapper;
using happykopiAPI.DTOs.Order;
using happykopiAPI.DTOs.Transaction.Outgoing_Data;
using happykopiAPI.Services.Interfaces;
using Microsoft.Data.SqlClient;
using System.Data;
using System.Text.Json;

namespace happykopiAPI.Services.Implementations
{
    public class TransactionService : ITransactionService
    {
        private readonly IConfiguration _configuration;
        private readonly INotificationService _notificationService;

        public TransactionService(IConfiguration configuration, INotificationService notificationService)
        {
            _configuration = configuration;
            _notificationService = notificationService;
        }

        private IDbConnection CreateConnection() => new SqlConnection(_configuration.GetConnectionString("LocalDB"));

        public async Task<TransactionSummaryDto> GetDailySummaryAsync()
        {
            using var connection = CreateConnection();

            var result = await connection.QueryFirstOrDefaultAsync<TransactionSummaryDto>(
                "sp_GetDailyTransactionSummary",
                commandType: CommandType.StoredProcedure
            );

            return result ?? new TransactionSummaryDto();
        }

        public async Task<IEnumerable<TransactionListItemDto>> GetTransactionHistoryAsync()
        {
            using var connection = CreateConnection();

            var result = await connection.QueryAsync<TransactionListItemDto>(
                "sp_GetTransactionHistoryToday",
                commandType: CommandType.StoredProcedure
            );

            return result;
        }

        public async Task<TransactionDetailsDto> GetTransactionByIdAsync(int orderId)
        {
            using var connection = CreateConnection();

            using var multi = await connection.QueryMultipleAsync(
                "sp_GetTransactionDetails",
                new { OrderId = orderId },
                commandType: CommandType.StoredProcedure
            );

            var details = await multi.ReadFirstOrDefaultAsync<TransactionDetailsDto>();
            if (details != null)
                details.Items = (await multi.ReadAsync<TransactionItemDto>()).ToList();

            return details;
        }
    }
}
