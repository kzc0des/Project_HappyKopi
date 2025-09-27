using System.ComponentModel.DataAnnotations;

namespace happykopiAPI.Models
{
    public class OrderItemAddOn
    {
        [Required]
        public int Id { get; set; }
        [Required]
        public int OrderItemId { get; set; }
        [Required]
        public int AddOnId { get; set; }
        [Required]
        public decimal Price { get; set; }

        public OrderItem OrderItem { get; set; }
        public AddOn AddOn { get; set; }
    }
}
