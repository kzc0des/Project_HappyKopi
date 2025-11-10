using happykopiAPI.DTOs.Order;
using happykopiAPI.DTOs.Transaction.Outgoing_Data;
using System.Collections.Generic;

namespace happykopiAPI.Services.Interfaces
{
    public interface ITransactionService
    {
        Task<decimal> RecordTransactionAsync(int orderId, IEnumerable<PaymentForCreateDto> transactions);
        Task<TransactionDetailsDto?> GetTransactionByIdAsync(int transactionId);
        Task<IEnumerable<TransactionDetailsDto>> GetTransactionByOrderIdAsync(int orderId);
        Task<IEnumerable<TransactionListItemDto>> GetTransactionsAsync(int page = 1, int pageSize = 25);
        Task<TransactionSummaryDto> GetDailySummaryAsync(DateTime date);
    }
}
