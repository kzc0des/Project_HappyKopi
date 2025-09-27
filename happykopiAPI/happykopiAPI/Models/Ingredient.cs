using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace happykopiAPI.Models
{
    public class Ingredient
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(100)]
        public string Name { get; set; }

        [Required]
        [MaxLength(20)]
        public string UnitOfMeasure { get; set; } 

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal AlertLevel { get; set; }

        [Required]
        public DateTime LastUpdated { get; set; }

        [Required]
        public bool IsPerishable { get; set; }
        public ICollection<ProductIngredient> Recipe { get; set; }
        public ICollection<IngredientBatch> Batches { get; set; }
        public ICollection<IngredientStockLog> StockLogs { get; set; }
        public ICollection<AddOnIngredient> AddOnRecipes { get; set; }
    }
}
