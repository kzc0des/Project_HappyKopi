using System.ComponentModel.DataAnnotations;

namespace happykopiAPI.DTOs.Order
{
    public class OrderItemForCreateDto
    {
        [Required]
        public int ProductId { get; set; }
        [Required]
        [Range(1, 100)]
        public int Quantity { get; set; }
    }
}
