namespace happykopiAPI.DTOs.Product.Internal
{
    public class StockItemFromDbDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string UnitOfMeasure { get; set; }
        public int ItemType { get; set; }
        public decimal AlertLevel { get; set; }
    }
}
