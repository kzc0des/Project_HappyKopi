namespace happykopiAPI.DTOs.Order.Internal
{ 
    public class NewOrderItemJsonDto
    {
        public int productVariantId { get; set; }
        public int quantity { get; set; }
        public decimal price { get; set; }
        public decimal subtotal { get; set; }
        public List<NewOrderModifierJsonDto> modifiers { get; set; } = new();
    } 
    public class NewOrderModifierJsonDto
    {
        public int modifierId { get; set; }
        public int quantity { get; set; }
        public decimal price { get; set; }
        public decimal subtotal { get; set; }
    }
}