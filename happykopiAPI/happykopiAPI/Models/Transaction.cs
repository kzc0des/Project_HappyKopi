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
        public int OrderId { get; set; } // Para saang order ang bayad na ito (One-to-one relationship)

        [Required]
        public PaymentType PaymentType { get; set; } // Cash o Cashless

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal AmountPaid { get; set; } // Magkano ang ibinayad ng customer

        [Column(TypeName = "decimal(18,2)")]
        public decimal Change { get; set; } // Sukli (kung cash)

        public DateTime TransactionDate { get; set; } = DateTime.UtcNow;

        [MaxLength(100)]
        public string ReferenceNumber { get; set; } // Para sa GCash, Maya, Card, etc.

        // Navigation Property
        [ForeignKey("OrderId")]
        public Order Order { get; set; }
    }
}
