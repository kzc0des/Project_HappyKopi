using happykopiAPI.Enums;

namespace happykopiAPI.DTOs.Order
{
    public class TransactionDto
    {
        public PaymentType PaymentType { get; set; }
        public decimal AmountPaid { get; set; }
        public decimal Change { get; set; }
        public string? ReferenceNumber { get; set; }
        public DateTime TransactionDate { get; set; }
    }
}
