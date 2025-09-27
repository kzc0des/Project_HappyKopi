using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace happykopiAPI.Models
{
    public class AddOn
    {
        [Required]
        public int Id { get; set; }

        [Required]
        [MaxLength(100)]
        public string Name { get; set; }

        [Required]
        [Column(TypeName = "decimal(18, 2")]
        public decimal Price { get; set; }

        [Required]
        public bool NeedsIngredientBreakdown { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal? StockQuantity { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal? AlertLevel { get; set; }

        [MaxLength(20)]
        public string? UnitOfMeasure { get; set; }
        public DateTime? ExpiryDate { get; set; }
        public DateTime LastUpdated { get; set; }

        // Navigation Properties
        public ICollection<OrderItemAddOn> OrderItemAddOns { get; set; }
        public ICollection<AddOnIngredient> Ingredients { get; set; }
    }
}
