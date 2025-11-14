using happykopiAPI.DTOs.Order;
using happykopiAPI.DTOs.Transaction.Outgoing_Data;
using System.Collections.Generic;

namespace happykopiAPI.Services.Interfaces
{
    public interface ITransactionService
    {
        Task<TransactionSummaryDto> GetDailySummaryAsync();
        Task<IEnumerable<TransactionListItemDto>> GetTransactionHistoryAsync();
        Task<TransactionDetailsDto> GetTransactionByIdAsync(int orderId);
    }
}
