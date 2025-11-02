namespace happykopiAPI.DTOs.Product.Dropdown_Data
{
    public class StockItemDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string UnitOfMeasure { get; set; }
        public string ItemType { get; set; } 
        public decimal AlertLevel { get; set; }
    }
}
