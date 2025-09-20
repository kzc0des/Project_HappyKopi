using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace happykopiAPI.Models
{
    public class Order
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(20)]
        public string OrderNumber { get; set; } // Isang unique na numero para sa madaling pag-track, e.g., "HK-0001"

        [Required]
        public int UserId { get; set; } // Ang Barista na nag-asikaso ng order

        public DateTime OrderDate { get; set; } = DateTime.UtcNow;

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal TotalAmount { get; set; } // Ang kabuuang halaga ng lahat ng items sa order

        [Required]
        public OrderStatus Status { get; set; } // Pending, Completed, o Cancelled

        // Navigation Properties
        [ForeignKey("UserId")]
        public User User { get; set; }

        public ICollection<OrderItem> OrderItems { get; set; } // Listahan ng mga produkto sa order na ito

        public Transaction Transaction { get; set; } // Ang payment details para sa order na ito
    }
}
