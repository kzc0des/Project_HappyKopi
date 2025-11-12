namespace happykopiAPI.DTOs.Order.Outgoing_Data
{ 
    public class NewOrderResponseDto
    {
        public int OrderId { get; set; }
        public string OrderNumber { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public DateTime OrderDate { get; set; }
        public decimal TotalAmount { get; set; }
        public decimal AmountPaid { get; set; }
        public decimal Change { get; set; }
    } 
    public class NewOrderDetailsDto
    {
        public int OrderId { get; set; }
        public string OrderNumber { get; set; } = string.Empty;
        public DateTime OrderDate { get; set; }
        public string Status { get; set; } = string.Empty;

        // Customer Info
        public int UserId { get; set; }
        public string CustomerName { get; set; } = string.Empty;

        // Order Items
        public List<NewOrderItemDetailDto> Items { get; set; } = new();

        // Payment Info
        public string PaymentType { get; set; } = string.Empty;
        public decimal Subtotal { get; set; }
        public decimal TotalAmount { get; set; }
        public decimal AmountPaid { get; set; }
        public decimal Change { get; set; }
        public string? ReferenceNumber { get; set; }
    }
 
    public class NewOrderItemDetailDto
    {
        public int OrderItemId { get; set; }
        public string ProductName { get; set; } = string.Empty;
        public string Size { get; set; } = string.Empty;
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal Subtotal { get; set; }
        public List<NewOrderModifierDetailDto> Modifiers { get; set; } = new();
    }
     
    public class NewOrderModifierDetailDto
    {
        public string ModifierName { get; set; } = string.Empty;
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal Subtotal { get; set; }
    }
     
    public class NewOrderErrorDto
    {
        public string Status { get; set; } = "ERROR";
        public string Message { get; set; } = string.Empty;
        public List<string> Errors { get; set; } = new();
    }
}
