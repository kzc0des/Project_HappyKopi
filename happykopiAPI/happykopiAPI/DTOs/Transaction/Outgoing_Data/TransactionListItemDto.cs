using happykopiAPI.Enums;
using System;

namespace happykopiAPI.DTOs.Transaction.Outgoing_Data
{
    public class TransactionListItemDto
    {
        public int Id { get; set; }
        public int OrderId { get; set; }
        public string? OrderNumber { get; set; }
        public string? BaristaName { get; set; }
        public PaymentType PaymentType { get; set; }
        public decimal AmountPaid { get; set; }
        public DateTime TransactionDate { get; set; }
    }
}