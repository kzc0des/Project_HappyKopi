namespace happykopiAPI.DTOs.Inventory.Outgoing_Data
{
    public class StockItemDetailsDto
    {
        //per item
        public int Id { get; set; }
        public string Name { get; set; }
        public string UnitOfMeasure { get; set; }
        public decimal AlertLevel { get; set; }
        public bool IsPerishable { get; set; }
        public int ItemType { get; set; }
        public bool IsActive { get; set; }
        public decimal TotalStockQuantity { get; set; }
        public int BatchCount { get; set; }
    }
}
