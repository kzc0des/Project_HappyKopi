using happykopiAPI.Enums;
using System;
using System.Collections.Generic;

namespace happykopiAPI.DTOs.Transaction.Outgoing_Data
{
    public class TransactionDetailsDto
    {
        public int Id { get; set; }
        public int OrderId { get; set; }
        public string? OrderNumber { get; set; }
        public string? BaristaName { get; set; }
        public PaymentType PaymentType { get; set; }
        public decimal AmountPaid { get; set; }
        public decimal Change { get; set; }
        public decimal TotalAmount { get; set; }
        public string? ReferenceNumber { get; set; }
        public DateTime TransactionDate { get; set; }
        public IEnumerable<TransactionItemDto>? Items { get; set; }
    }
}