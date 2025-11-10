namespace happykopiAPI.DTOs.Transaction.Outgoing_Data
{
    public class PaymentSummaryDto
    {
        public decimal TotalAmount { get; set; }
        public int TotalTransactions { get; set; }
    }

    public class TransactionSummaryDto
    {
        public decimal TotalSales { get; set; }
        public int TotalTransactions { get; set; }
        public PaymentSummaryDto CashSummary { get; set; } = new();
        public PaymentSummaryDto CashlessSummary { get; set; } = new();
    }
}