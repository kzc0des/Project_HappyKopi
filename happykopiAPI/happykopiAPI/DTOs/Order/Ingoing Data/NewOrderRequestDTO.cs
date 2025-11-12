namespace happykopiAPI.DTOs.Order.Ingoing_Data
{
    /// <summary>
    /// Main request DTO for creating a new order
    /// </summary>
    public class NewOrderRequestDto
    {
        public int UserId { get; set; }
        public decimal TotalAmount { get; set; }
        public string Status { get; set; } = "Completed"; // Default: Completed
        public string PaymentType { get; set; } // Cash, GCash, Card, etc.
        public decimal AmountPaid { get; set; }
        public decimal Change { get; set; }
        public string? ReferenceNumber { get; set; } // Optional for Cash
        public List<NewOrderItemDto> OrderItems { get; set; } = new();
    }
}