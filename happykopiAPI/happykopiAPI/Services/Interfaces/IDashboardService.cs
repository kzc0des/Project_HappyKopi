using happykopiAPI.DTOs.Dashboard.Outgoing_Data;
using happykopiAPI.DTOs.Transaction.Outgoing_Data;

namespace happykopiAPI.Services.Interfaces
{
    public interface IDashboardService
    {
        Task<TransactionSummaryDto> GetTodaySummaryAsync();
        Task<TransactionSummaryDto> GetWeeklySummaryAsync();
        Task<TransactionSummaryDto> GetMonthlySummaryAsync();
        Task<IEnumerable<ChartPointDto>> GetChartTodayAsync();
        Task<IEnumerable<ChartPointDto>> GetChartThisWeekAsync();
        Task<IEnumerable<ChartPointDto>> GetChartThisMonthAsync();
    }
}
