namespace happykopiAPI.DTOs.Inventory.Outgoing_Data
{
    public class LowStockItemDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string UnitOfMeasure { get; set; }
        public decimal TotalStockQuantity { get; set; }
        public decimal AlertLevel { get; set; }
    }
}
