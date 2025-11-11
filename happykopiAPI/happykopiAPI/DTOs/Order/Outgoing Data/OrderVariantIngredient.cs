namespace happykopiAPI.DTOs.Order.Outgoing_Data
{
    public class OrderVariantIngredientDto
    { 
        public int ProductVariantId { get; set; }
         
        public int StockItemId { get; set; }
         
        public decimal QuantityNeeded { get; set; }
    }
}