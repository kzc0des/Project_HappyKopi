namespace happykopiAPI.DTOs.Dashboard.Outgoing_Data
{
    public class TransactionListItemAdminDto
    {
        public int OrderId { get; set; }
        public string OrderNumber { get; set; } = string.Empty;
        public string BaristaName { get; set; } = string.Empty;
        public DateTime TransactionDate { get; set; }
        public decimal Total { get; set; }
        public string PaymentMethod { get; set; } = string.Empty; // Cash or Cashless
    }
}
