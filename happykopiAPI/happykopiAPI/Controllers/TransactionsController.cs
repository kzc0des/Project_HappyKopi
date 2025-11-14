using happykopiAPI.Data;
using happykopiAPI.DTOs.Order;
using happykopiAPI.DTOs.Transaction.Outgoing_Data;
using happykopiAPI.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System.Linq;

namespace happykopiAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TransactionsController : ControllerBase
    {
        private readonly ITransactionService _transactionService;

        public TransactionsController(ITransactionService transactionService)
        {
            _transactionService = transactionService;
        }

        [HttpGet("summary")]
        public async Task<ActionResult<TransactionSummaryDto>> GetDailySummary()
        {
            var summary = await _transactionService.GetDailySummaryAsync();
            return Ok(summary);
        }

        [HttpGet("history")]
        public async Task<ActionResult<IEnumerable<TransactionListItemDto>>> GetTransactionHistory()
        {
            var transactions = await _transactionService.GetTransactionHistoryAsync();
            return Ok(transactions);
        }

        [HttpGet("{orderId}")]
        public async Task<ActionResult<TransactionDetailsDto>> GetTransactionById(int orderId)
        {
            var transaction = await _transactionService.GetTransactionByIdAsync(orderId);
            if (transaction == null)
                return NotFound();

            return Ok(transaction);
        }
    }
}
