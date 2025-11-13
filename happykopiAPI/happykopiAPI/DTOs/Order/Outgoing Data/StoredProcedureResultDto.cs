namespace happykopiAPI.DTOs.Order.Outgoing_Data
{
    public class StoredProcedureResultDto
    {
        public int OrderId { get; set; }
        public string OrderNumber { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;

    }
}