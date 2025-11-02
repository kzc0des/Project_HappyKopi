using System.ComponentModel.DataAnnotations;

namespace happykopiAPI.DTOs.Product.Incoming_Data
{
    public class ProductVariantIngredientCreateDto
    {
        [Required]
        public int StockItemId { get; set; }

        [Required]
        [Range(0.01, double.MaxValue, ErrorMessage = "Quantity must be greater than 0")]
        public decimal QuantityNeeded { get; set; }
    }
}
