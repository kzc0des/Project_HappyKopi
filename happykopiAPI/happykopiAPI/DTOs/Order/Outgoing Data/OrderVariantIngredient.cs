namespace happykopiAPI.DTOs.Order.Outgoing_Data
{
    public class OrderVariantIngredientDto
    {
        public int ProductVariantId { get; set; }
        public int StockItemId { get; set; }
        public string StockItemName { get; set; } = string.Empty;
        public decimal QuantityNeeded { get; set; }
        public string UnitOfMeasure { get; set; } = string.Empty; 
        public decimal AvailableStock { get; set; }
        // NEW: To identify if this is a base ingredient or modifier ingredient (cup, container, etc.)
        public int IsModifierIngredient { get; set; }  // 0 = base ingredient, 1 = modifier ingredient

        // NEW: The modifier ID if this is a modifier ingredient
        public int? ModifierId { get; set; }

    }
}