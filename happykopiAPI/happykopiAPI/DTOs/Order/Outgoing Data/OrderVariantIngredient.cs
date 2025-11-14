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

    }
}