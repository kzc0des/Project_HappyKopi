using System.ComponentModel.DataAnnotations;

namespace happykopiAPI.DTOs.Product.Incoming_Data
{
    public class ProductCreateDto
    {
        [Required]
        public string Name { get; set; }

        public string Description { get; set; }

        public string ImageUrl { get; set; }

        [Required]
        public int CategoryId { get; set; }

        public bool IsAvailable { get; set; } = true;

        public bool IsActive { get; set; } = true;

        public ICollection<ProductVariantCreateDto> Variants { get; set; } = new List<ProductVariantCreateDto>();
    }
}
