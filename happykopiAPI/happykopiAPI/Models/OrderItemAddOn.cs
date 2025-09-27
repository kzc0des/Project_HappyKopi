using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace happykopiAPI.Models
{
    public class OrderItemAddOn
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public int OrderItemId { get; set; }
        [Required]
        public int AddOnId { get; set; }

        [Required]
        [Column(TypeName = "decimal(18, 2)")]
        public decimal Price { get; set; }

        public OrderItem OrderItem { get; set; }
        public AddOn AddOn { get; set; }
    }
}
