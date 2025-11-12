namespace happykopiAPI.DTOs.Order.Ingoing_Data {
    public class NewOrderItemDto
    {
        public int ProductVariantId { get; set; }
        public int Quantity { get; set; }
        public decimal Price { get; set; } // Unit price
        public decimal Subtotal { get; set; } // Price * Quantity + Modifiers
        public List<NewOrderModifierDto> Modifiers { get; set; } = new();
    }
}


