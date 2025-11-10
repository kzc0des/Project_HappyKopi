using System.Linq;
using happykopiAPI.Data;
using happykopiAPI.DTOs.Order;
using happykopiAPI.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace happykopiAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TransactionsController : ControllerBase
    {
        private readonly ITransactionService _transactionService;
        private readonly HappyKopiDbContext _context;

        public TransactionsController(HappyKopiDbContext context, ITransactionService transactionService)
        {
            _transactionService = transactionService;
            _context = context;
        }

        [HttpPost("record/{orderId}")]
        public async Task<IActionResult> Record(int orderId, [FromBody] IEnumerable<PaymentForCreateDto> payments)
        {
            if (payments == null || !payments.Any()) return BadRequest("Payments required");

            try
            {
                var change = await _transactionService.RecordTransactionAsync(orderId, payments);
                return Ok(new { Change = change });
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById(int id)
        {
            // Try as transaction id first
            var tx = await _transactionService.GetTransactionByIdAsync(id);
            if (tx != null) return Ok(tx);

            // If not found by transaction id, attempt to treat the id as an orderId and return the first transaction for that order.
            var txByOrder = await _transactionService.GetTransactionByOrderIdAsync(id);
            if (txByOrder != null && txByOrder.Any())
            {
                return Ok(txByOrder.First());
            }

            return NotFound();
        }

        [HttpGet("by-order/{orderId:int}")]
        public async Task<IActionResult> GetByOrderId(int orderId)
        {
            var tx = await _transactionService.GetTransactionByOrderIdAsync(orderId);
            // Return 200 with an empty array when there are no transactions for the order
            return Ok(tx);
        }

        // GET api/transactions/history?page=1&pageSize=10
        [HttpGet("history")]
        public async Task<IActionResult> GetHistory([FromQuery] int page = 1, [FromQuery] int pageSize = 10)
        {
            var transactions = await _transactionService.GetTransactionsAsync(page, pageSize);
            return Ok(transactions);
        }

        // GET api/transactions/daily-summary/2025-11-10
        [HttpGet("daily-summary/{date}")]
        public async Task<IActionResult> GetDailySummary(string date)
        {
            if (!DateTime.TryParse(date, out var parsedDate))
                return BadRequest("Invalid date format. Use yyyy-MM-dd.");

            var summary = await _transactionService.GetDailySummaryAsync(parsedDate.Date);
            return Ok(summary);
        }
    }
}
