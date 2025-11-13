using happykopiAPI.DTOs.Dashboard.Outgoing_Data;
using happykopiAPI.DTOs.Transaction.Outgoing_Data;
using happykopiAPI.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace happykopiAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DashboardController : ControllerBase
    {
        private readonly IDashboardService _dashboardService;
        private readonly ITransactionService _transactionService;

        public DashboardController(
            IDashboardService dashboardService,
            ITransactionService transactionService)
        {
            _dashboardService = dashboardService;
            _transactionService = transactionService;
        }

        // ===== SUMMARY ENDPOINTS =====
        [HttpGet("today")]
        public async Task<ActionResult<TransactionSummaryDto>> GetToday()
        {
            var result = await _dashboardService.GetTodaySummaryAsync();
            return Ok(result);
        }

        [HttpGet("this-week")]
        public async Task<ActionResult<TransactionSummaryDto>> GetThisWeek()
        {
            var result = await _dashboardService.GetWeeklySummaryAsync();
            return Ok(result);
        }

        [HttpGet("this-month")]
        public async Task<ActionResult<TransactionSummaryDto>> GetThisMonth()
        {
            var result = await _dashboardService.GetMonthlySummaryAsync();
            return Ok(result);
        }

        // ===== CHART ENDPOINTS =====
        [HttpGet("chart/today")]
        public async Task<ActionResult<IEnumerable<ChartPointDto>>> GetChartToday()
        {
            var result = await _dashboardService.GetChartTodayAsync();
            return Ok(result);
        }

        [HttpGet("chart/this-week")]
        public async Task<ActionResult<IEnumerable<ChartPointDto>>> GetChartThisWeek()
        {
            var result = await _dashboardService.GetChartThisWeekAsync();
            return Ok(result);
        }

        [HttpGet("chart/this-month")]
        public async Task<ActionResult<IEnumerable<ChartPointDto>>> GetChartThisMonth()
        {
            var result = await _dashboardService.GetChartThisMonthAsync();
            return Ok(result);
        }

        [HttpGet("transactions/history")]
        public async Task<ActionResult<IEnumerable<TransactionListItemDto>>> GetTransactionHistory()
        {
            var result = await _dashboardService.GetTransactionHistoryAsync();
            return Ok(result);
        }
    }
}
    