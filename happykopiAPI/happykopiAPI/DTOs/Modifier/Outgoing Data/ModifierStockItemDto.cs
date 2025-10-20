namespace happykopiAPI.DTOs.Modifier.Outgoing_Data
{
    public class ModifierStockItemDto
    {
        public int StockItemId { get; set; }
        public string StockItemName { get; set; }
        public decimal QuantityNeeded { get; set; }
    }
}
