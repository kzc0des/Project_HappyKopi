using happykopiAPI.Enums;

namespace happykopiAPI.DTOs.Transaction.Outgoing_Data
{
    public class TransactionDetailsDto
    {
        public string OrderId { get; set; }
        public decimal Total { get; set; }
        public DateTime TransactionDate { get; set; }
        public string PaymentMethod { get; set; }
        public string BaristaName { get; set; }
        public List<TransactionItemDto> Items { get; set; }
    }

    public class TransactionItemDto
    {
        public string ProductName { get; set; }
        public string ProductImage { get; set; }
        public int Quantity { get; set; }
        public decimal Price { get; set; }
    }
}
