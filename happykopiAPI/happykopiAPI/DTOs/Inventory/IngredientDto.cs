using System.ComponentModel.DataAnnotations;

namespace happykopiAPI.DTOs.Inventory
{
    public class IngredientDto
    {
        public int Id { get; set; }
        [Required]
        public string Name { get; set; }
        [Required]
        [Range(0, double.MaxValue)]
        public decimal StockQuantity { get; set; }
        [Required]
        public string UnitOfMeasure { get; set; }
        [Required]
        [Range(0, double.MaxValue)]
        public decimal AlertLevel { get; set; }
        public DateTime LastUpdated { get; set; }
    }
}
