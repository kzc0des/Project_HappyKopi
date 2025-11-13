namespace happykopiAPI.DTOs.Order.Outgoing_Data
{
    public class OrderVarianAddontDto
    {
        public int ProductVariantId { get; set; }
        public int ModifierId { get; set; }
        public string ModifierName { get; set; } = string.Empty;
        public decimal ModifierPrice { get; set; }
        public int ModifierType { get; set; }
        public int DefaultQuantity { get; set; }

    }
}