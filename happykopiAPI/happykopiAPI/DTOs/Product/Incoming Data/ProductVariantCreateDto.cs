using System.ComponentModel.DataAnnotations;

namespace happykopiAPI.DTOs.Product.Incoming_Data
{
    public class ProductVariantCreateDto
    {
        [Required]
        public string Size { get; set; }

        [Required]
        [Range(0.01, double.MaxValue, ErrorMessage = "Price must be greater than 0")]
        public decimal Price { get; set; }

        public ICollection<ProductVariantIngredientCreateDto> Recipe { get; set; } = [];
        public ICollection<ProductVariantAddOnCreateDto> AddOns { get; set; } = [];
    }
}
