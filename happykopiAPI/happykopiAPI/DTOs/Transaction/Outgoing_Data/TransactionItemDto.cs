namespace happykopiAPI.DTOs.Transaction.Outgoing_Data
{
    public class TransactionItemDto
    {
        public string ProductName { get; set; } = string.Empty;
        public string? Variant { get; set; }
        public int Quantity { get; set; }
        public decimal Price { get; set; }
        public decimal Subtotal { get; set; }
    }
}
