using System.ComponentModel.DataAnnotations;

namespace happykopiAPI.DTOs.Product.Incoming_Data
{
    public class ProductVariantAddOnCreateDto
    {
        [Required]
        public int AddOnId { get; set; } 

        [Required]
        [Range(0, 100)]
        public int Times { get; set; }
    }
}
