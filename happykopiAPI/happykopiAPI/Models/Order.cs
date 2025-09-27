using happykopiAPI.Enums;
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
        public string OrderNumber { get; set; } 

        [Required]
        public int UserId { get; set; } 

        public DateTime OrderDate { get; set; } 

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal TotalAmount { get; set; } 

        [Required]
        public OrderStatus Status { get; set; } 

        [ForeignKey("UserId")]
        public User User { get; set; }

        public ICollection<OrderItem> OrderItems { get; set; } 

        public Transaction Transaction { get; set; } 
    }
}
