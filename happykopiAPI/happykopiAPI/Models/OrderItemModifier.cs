using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace happykopiAPI.Models
{
    public class OrderItemModifier
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public int OrderItemId { get; set; }

        [Required]
        public int ModifierId { get; set; }

        [Required]
        public int Quantity { get; set; }

        [Required]
        [Column(TypeName = "decimal(18, 2)")]
        public decimal Price { get; set; }

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal Subtotal { get; set; }

        public OrderItem OrderItem { get; set; }
        public Modifier Modifier { get; set; }
    }
}
