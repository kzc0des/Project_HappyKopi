
using happykopiAPI.Enums;
using System.ComponentModel.DataAnnotations;

namespace happykopiAPI.DTOs.Order
{
    public class PaymentForCreateDto
    {
        [Required]
        public PaymentType PaymentType { get; set; }
        [Required]
        [Range(0, double.MaxValue)]
        public decimal AmountPaid { get; set; }
        public string? ReferenceNumber { get; set; }
    }
}
