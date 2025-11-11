namespace happykopiAPI.DTOs.Order.Outgoing_Data
{
    public class OrderModifierSummaryDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public decimal? Price { get; set; }
        public int Type { get; set; }

    }
}
    