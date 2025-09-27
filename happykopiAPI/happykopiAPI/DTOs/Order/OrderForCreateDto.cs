using System.ComponentModel.DataAnnotations;

namespace happykopiAPI.DTOs.Order
{
    public class OrderForCreateDto
    {
        [Required]
        public List<OrderItemForCreateDto> OrderItems { get; set; }
        [Required]
        public PaymentForCreateDto Payment { get; set; }
        public ICollection<int> SelectedAddOnIds { get; set; } = new List<int>();
    }
}
