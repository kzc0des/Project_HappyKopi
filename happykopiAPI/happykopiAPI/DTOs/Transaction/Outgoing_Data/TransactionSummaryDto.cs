namespace happykopiAPI.DTOs.Transaction.Outgoing_Data
{
    public class TransactionSummaryDto
    {
        public decimal TotalSalesToday { get; set; }
        public int TransactionsToday { get; set; }
        public int CashPayments { get; set; }
        public int CashlessPayments { get; set; }
    }
}
