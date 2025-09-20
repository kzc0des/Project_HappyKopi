using System.ComponentModel.DataAnnotations;

namespace happykopiAPI.DTOs.Product
{
    public class ProductIngredientDto
    {
        [Required]
        public int IngredientId { get; set; }
        public string IngredientName { get; set; }
        [Required]
        [Range(0.01, double.MaxValue)]
        public decimal QuantityNeeded { get; set; }
    }
}
