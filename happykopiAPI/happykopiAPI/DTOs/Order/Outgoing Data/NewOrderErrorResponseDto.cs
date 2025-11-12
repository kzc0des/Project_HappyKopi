namespace happykopiAPI.DTOs.Order.Outgoing_Data
{
    public class NewOrderErrorResponseDto
    {
        public int OrderId { get; set; }
        public string OrderNumber { get; set; } = string.Empty;
        public string Status { get; set; } = "ERROR";
        public string Message { get; set; } = string.Empty;
        public List<string> Errors { get; set; } = new();
    }
}