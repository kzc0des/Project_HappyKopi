using happykopiAPI.Enums;

namespace happykopiAPI.DTOs.Transaction.Outgoing_Data
{
    public class TransactionListItemDto
    {
        public string OrderId { get; set; }
        public string BaristaName { get; set; }
        public DateTime TransactionDate { get; set; }
        public decimal TotalAmount { get; set; }
        public PaymentType PaymentMethod { get; set; }
    }
}
