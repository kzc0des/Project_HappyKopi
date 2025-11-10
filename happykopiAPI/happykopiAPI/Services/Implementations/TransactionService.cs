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

        public TransactionService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        private IDbConnection CreateConnection() => new SqlConnection(_configuration.GetConnectionString("LocalDB"));

        public async Task<decimal> RecordTransactionAsync(int orderId, IEnumerable<PaymentForCreateDto> transactions)
        {
            var tvp = new DataTable();
            tvp.Columns.Add("PaymentType", typeof(string));
            tvp.Columns.Add("AmountPaid", typeof(decimal));
            tvp.Columns.Add("ReferenceNumber", typeof(string));

            foreach (var t in transactions)
            {
                var paymentType = t.PaymentType.ToString(); 
                tvp.Rows.Add(paymentType, t.AmountPaid, t.ReferenceNumber ?? (object)DBNull.Value);
            }

            await using var sqlConnection = new SqlConnection(_configuration.GetConnectionString("LocalDB"));
            await sqlConnection.OpenAsync();

            await using var cmd = new SqlCommand("sp_RecordTransaction", sqlConnection)
            {
                CommandType = CommandType.StoredProcedure
            };

            var orderParam = new SqlParameter("@OrderId", SqlDbType.Int) { Value = orderId };
            var tvpParam = new SqlParameter("@Transactions", SqlDbType.Structured)
            {
                TypeName = "dbo.TransactionsType",
                Value = tvp
            };

            cmd.Parameters.Add(orderParam);
            cmd.Parameters.Add(tvpParam);

            var result = await cmd.ExecuteScalarAsync();
            if (result == null || result == DBNull.Value) return 0m;

            try
            {
                return Convert.ToDecimal(result);
            }
            catch
            {
                return 0m;
            }
        }

        public async Task<TransactionDetailsDto?> GetTransactionByIdAsync(int transactionId)
        {
            using var connection = CreateConnection();
            // use synchronous Open on IDbConnection to avoid calling OpenAsync on IDbConnection
            connection.Open();

            using var multi = await connection.QueryMultipleAsync(
                "sp_GetTransactionById",
                new { TransactionId = transactionId },
                commandType: CommandType.StoredProcedure);

            var header = await multi.ReadSingleOrDefaultAsync<TransactionDetailsDto>();
            if (header == null) return null;

            var items = (await multi.ReadAsync<TransactionItemDto>()).ToList();
            header.Items = items;
            return header;
        }

        public async Task<IEnumerable<TransactionDetailsDto>> GetTransactionByOrderIdAsync(int orderId)
        {
            using var connection = CreateConnection();
            var result = await connection.QueryAsync<TransactionDetailsDto>(
                "sp_GetTransactionByOrderId",
                new { OrderId = orderId },
                commandType: CommandType.StoredProcedure);
            return result;
        }

        public async Task<IEnumerable<TransactionListItemDto>> GetTransactionsAsync(int page = 1, int pageSize = 25)
        {
            using var connection = CreateConnection();
            var results = await connection.QueryAsync<TransactionListItemDto>(
                "sp_GetTransactions",
                new { Page = page, PageSize = pageSize },
                commandType: CommandType.StoredProcedure);
            return results;
        }

        public async Task<TransactionSummaryDto> GetDailySummaryAsync(DateTime date)
        {
            await using var connection = new SqlConnection(_configuration.GetConnectionString("LocalDB"));
            await connection.OpenAsync();

            var sql = @"
                SELECT
                    ISNULL(SUM(CASE WHEN CAST(TransactionDate AS date) = @Date THEN AmountPaid ELSE 0 END), 0) AS TotalSales,
                    ISNULL(SUM(CASE WHEN CAST(TransactionDate AS date) = @Date THEN 1 ELSE 0 END), 0) AS TotalTransactions,
                    ISNULL(SUM(CASE WHEN CAST(TransactionDate AS date) = @Date AND PaymentType = 'Cash' THEN AmountPaid ELSE 0 END), 0) AS CashTotal,
                    ISNULL(SUM(CASE WHEN CAST(TransactionDate AS date) = @Date AND PaymentType = 'Cash' THEN 1 ELSE 0 END), 0) AS CashTransactions,
                    ISNULL(SUM(CASE WHEN CAST(TransactionDate AS date) = @Date AND PaymentType <> 'Cash' THEN AmountPaid ELSE 0 END), 0) AS CashlessTotal,
                    ISNULL(SUM(CASE WHEN CAST(TransactionDate AS date) = @Date AND PaymentType <> 'Cash' THEN 1 ELSE 0 END), 0) AS CashlessTransactions
                FROM dbo.Transactions;
            ";

            var row = await connection.QuerySingleAsync(sql, new { Date = date.Date });

            var summary = new TransactionSummaryDto
            {
                TotalSales = (decimal)row.TotalSales,
                TotalTransactions = (int)row.TotalTransactions,
                CashSummary = new PaymentSummaryDto
                {
                    TotalAmount = (decimal)row.CashTotal,
                    TotalTransactions = (int)row.CashTransactions
                },
                CashlessSummary = new PaymentSummaryDto
                {
                    TotalAmount = (decimal)row.CashlessTotal,
                    TotalTransactions = (int)row.CashlessTransactions
                }
            };

            return summary;
        }
    }
}
