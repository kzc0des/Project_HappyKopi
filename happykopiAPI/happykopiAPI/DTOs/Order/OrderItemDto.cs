using happykopiAPI.Models;

namespace happykopiAPI.DTOs.Order
{
    public class OrderItemDto
    {
        public string ProductName { get; set; }
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal Subtotal { get; set; }
        public ICollection<OrderItemModifier> OrderItemModifier { get; set; }
    }
}
