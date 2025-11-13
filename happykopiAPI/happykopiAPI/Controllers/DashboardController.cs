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

        public DashboardController(IDashboardService dashboardService)
        {
            _dashboardService = dashboardService;
        }

        [HttpGet("today")]
        public async Task<ActionResult<TransactionSummaryDto>> GetToday()
            => Ok(await _dashboardService.GetTodaySummaryAsync());

        [HttpGet("this-week")]
        public async Task<ActionResult<TransactionSummaryDto>> GetThisWeek()
            => Ok(await _dashboardService.GetWeeklySummaryAsync());

        [HttpGet("this-month")]
        public async Task<ActionResult<TransactionSummaryDto>> GetThisMonth()
            => Ok(await _dashboardService.GetMonthlySummaryAsync());

        [HttpGet("chart/today")]
        public async Task<ActionResult<IEnumerable<ChartPointDto>>> GetChartToday()
            => Ok(await _dashboardService.GetChartTodayAsync());

        [HttpGet("chart/this-week")]
        public async Task<ActionResult<IEnumerable<ChartPointDto>>> GetChartThisWeek()
            => Ok(await _dashboardService.GetChartThisWeekAsync());

        [HttpGet("chart/this-month")]
        public async Task<ActionResult<IEnumerable<ChartPointDto>>> GetChartThisMonth()
            => Ok(await _dashboardService.GetChartThisMonthAsync());
    }
}


