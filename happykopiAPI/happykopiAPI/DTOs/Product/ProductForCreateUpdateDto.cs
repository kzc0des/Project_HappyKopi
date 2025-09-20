using System.ComponentModel.DataAnnotations;

namespace happykopiAPI.DTOs.Product
{
    public class ProductForCreateUpdateDto
    {
        [Required]
        public string Name { get; set; }
        public string? Description { get; set; }
        [Required]
        [Range(1, double.MaxValue)]
        public decimal Price { get; set; }
        public string? ImageUrl { get; set; }
        public bool IsAvailable { get; set; } = true;
        [Required]
        public int CategoryId { get; set; }

        // Listahan ng mga ingredients para sa recipe
        public ICollection<ProductIngredientDto> Recipe { get; set; }
    }
}
