using Dapper;
using happykopiAPI.DTOs.Transaction.Outgoing_Data;
using happykopiAPI.DTOs.Dashboard.Outgoing_Data;
using happykopiAPI.Services.Interfaces;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;

namespace happykopiAPI.Services.Implementations
{
    public class DashboardService : IDashboardService
    {
        private readonly IConfiguration _configuration;

        public DashboardService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        private SqlConnection CreateConnection()
            => new SqlConnection(_configuration.GetConnectionString("LocalDB"));

        // --- Summary Methods ---

        public async Task<TransactionSummaryDto> GetTodaySummaryAsync()
        {
            var today = DateTime.Today;
            return await GetSummaryForRangeAsync(today, today.AddDays(1).AddTicks(-1));
        }

        public async Task<TransactionSummaryDto> GetWeeklySummaryAsync()
        {
            var today = DateTime.Today;
            var startOfWeek = today.AddDays(-(int)today.DayOfWeek + (int)DayOfWeek.Monday);
            var endOfWeek = startOfWeek.AddDays(7).AddTicks(-1);
            return await GetSummaryForRangeAsync(startOfWeek, endOfWeek);
        }

        public async Task<TransactionSummaryDto> GetMonthlySummaryAsync()
        {
            var today = DateTime.Today;
            var startOfMonth = new DateTime(today.Year, today.Month, 1);
            var endOfMonth = startOfMonth.AddMonths(1).AddTicks(-1);
            return await GetSummaryForRangeAsync(startOfMonth, endOfMonth);
        }

        private async Task<TransactionSummaryDto> GetSummaryForRangeAsync(DateTime startDate, DateTime endDate)
        {
            await using var connection = CreateConnection();
            await connection.OpenAsync();

            var sql = @"
                SELECT
                    ISNULL(SUM(CASE WHEN TransactionDate BETWEEN @StartDate AND @EndDate THEN AmountPaid ELSE 0 END), 0) AS TotalSalesToday,
                    ISNULL(SUM(CASE WHEN TransactionDate BETWEEN @StartDate AND @EndDate THEN 1 ELSE 0 END), 0) AS TransactionsToday,
                    ISNULL(SUM(CASE WHEN TransactionDate BETWEEN @StartDate AND @EndDate AND PaymentType = 'Cash' THEN 1 ELSE 0 END), 0) AS CashPayments,
                    ISNULL(SUM(CASE WHEN TransactionDate BETWEEN @StartDate AND @EndDate AND PaymentType <> 'Cash' THEN 1 ELSE 0 END), 0) AS CashlessPayments
                FROM dbo.Transactions;
            ";

            var summary = await connection.QuerySingleAsync<TransactionSummaryDto>(
                sql,
                new { StartDate = startDate, EndDate = endDate }
            );

            return summary;
        }

        // --- Chart Methods ---

        public async Task<IEnumerable<ChartPointDto>> GetChartTodayAsync()
        {
            var today = DateTime.Today;
            var start = today;
            var end = today.AddDays(1).AddTicks(-1);

            await using var connection = CreateConnection();
            await connection.OpenAsync();

            var sql = @"
                SELECT 
                    FORMAT(TransactionDate, 'HH:00') AS Label,
                    SUM(AmountPaid) AS TotalSales
                FROM dbo.Transactions
                WHERE TransactionDate BETWEEN @StartDate AND @EndDate
                GROUP BY FORMAT(TransactionDate, 'HH:00')
                ORDER BY Label;
            ";

            return await connection.QueryAsync<ChartPointDto>(sql, new { StartDate = start, EndDate = end });
        }

        public async Task<IEnumerable<ChartPointDto>> GetChartThisWeekAsync()
        {
            var today = DateTime.Today;
            var startOfWeek = today.AddDays(-(int)today.DayOfWeek + (int)DayOfWeek.Monday);
            var endOfWeek = startOfWeek.AddDays(7).AddTicks(-1);

            await using var connection = CreateConnection();
            await connection.OpenAsync();

            var sql = @"
                SELECT 
                    DATENAME(WEEKDAY, TransactionDate) AS Label,
                    SUM(AmountPaid) AS TotalSales
                FROM dbo.Transactions
                WHERE TransactionDate BETWEEN @StartDate AND @EndDate
                GROUP BY DATENAME(WEEKDAY, TransactionDate), DATEPART(WEEKDAY, TransactionDate)
                ORDER BY DATEPART(WEEKDAY, TransactionDate);
            ";

            return await connection.QueryAsync<ChartPointDto>(sql, new { StartDate = startOfWeek, EndDate = endOfWeek });
        }

        public async Task<IEnumerable<ChartPointDto>> GetChartThisMonthAsync()
        {
            var today = DateTime.Today;
            var startOfMonth = new DateTime(today.Year, today.Month, 1);
            var endOfMonth = startOfMonth.AddMonths(1).AddTicks(-1);

            await using var connection = CreateConnection();
            await connection.OpenAsync();

            var sql = @"
                SELECT 
                    DAY(TransactionDate) AS Label,
                    SUM(AmountPaid) AS TotalSales
                FROM dbo.Transactions
                WHERE TransactionDate BETWEEN @StartDate AND @EndDate
                GROUP BY DAY(TransactionDate)
                ORDER BY DAY(TransactionDate);
            ";

            return await connection.QueryAsync<ChartPointDto>(sql, new { StartDate = startOfMonth, EndDate = endOfMonth });
        }

        public async Task<IEnumerable<TransactionListItemAdminDto>> GetTransactionHistoryAsync()
        {
            await using var connection = CreateConnection();
            await connection.OpenAsync();

            var sql = @"
    SELECT 
        o.Id AS OrderId,
        o.OrderNumber,
        u.FullName AS BaristaName,
        t.TransactionDate,
        o.TotalAmount AS Total,
        -- Compare string literals instead of 0
        CASE WHEN t.PaymentType = 'Cash' THEN 'Cash' ELSE 'Cashless' END AS PaymentMethod
    FROM Transactions t
    INNER JOIN Orders o ON o.Id = t.OrderId
    INNER JOIN Users u ON o.UserId = u.Id
    WHERE CAST(t.TransactionDate AS DATE) = CAST(GETDATE() AS DATE)
    ORDER BY t.TransactionDate DESC;
";


            var result = await connection.QueryAsync<TransactionListItemAdminDto>(sql);
            return result;
        }

    }
}
