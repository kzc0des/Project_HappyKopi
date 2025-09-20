namespace happykopiAPI.DTOs.Order
{
    public class OrderDto
    {
        public int Id { get; set; }
        public string OrderNumber { get; set; }
        public string BaristaName { get; set; }
        public DateTime OrderDate { get; set; }
        public decimal TotalAmount { get; set; }
        public string Status { get; set; }
        public List<OrderItemDto> OrderItems { get; set; }
        public TransactionDto Transaction { get; set; }
    }
}
