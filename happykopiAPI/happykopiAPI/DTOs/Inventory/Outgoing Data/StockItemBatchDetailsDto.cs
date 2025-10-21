namespace happykopiAPI.DTOs.Inventory.Outgoing_Data
{
    public class StockItemBatchDetailsDto
    {
        public int Id { get; set; }
        public decimal StockQuantity { get; set; }
        public DateTime DateReceived { get; set; }
        public DateTime? ExpiryDate { get; set; }
    }
}
