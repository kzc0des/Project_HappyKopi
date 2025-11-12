namespace happykopiAPI.DTOs.Order.Ingoing_Data
{
    public class NewOrderModifierDto
    {
        public int ModifierId { get; set; }
        public int Quantity { get; set; }
        public decimal Price { get; set; } // Unit price of modifier
        public decimal Subtotal { get; set; } // Price * Quantity
    }
}