using happykopiAPI.Enums;

namespace happykopiAPI.DTOs.Inventory
{
    public class StockItemForCreateDto
    {
        public string Name { get; set; }
        public string Unit { get; set; }
        public decimal InitialStock { get; set; } 
        public decimal LowStockThreshold { get; set; }
        public StockItemType ItemType { get; set; }
    }
}
