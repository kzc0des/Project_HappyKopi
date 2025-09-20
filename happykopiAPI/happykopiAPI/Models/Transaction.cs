using happykopiAPI.Enums;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace happykopiAPI.Models
{
    public class Transaction
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int OrderId { get; set; } 

        [Required]
        public PaymentType PaymentType { get; set; } 

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal AmountPaid { get; set; } 

        [Column(TypeName = "decimal(18,2)")]
        public decimal Change { get; set; } 

        public DateTime TransactionDate { get; set; } = DateTime.UtcNow;

        [MaxLength(100)]
        public string? ReferenceNumber { get; set; } 

        [ForeignKey("OrderId")]
        public Order Order { get; set; }
    }
}
