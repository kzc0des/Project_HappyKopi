using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace happykopiAPI.Models
{
    public class DailyIngredientSummary
    {
        [Key]
        public long Id { get; set; } // Gumamit tayo ng 'long' para sigurado kahit dumami pa ang logs over the years

        [Required]
        public int IngredientId { get; set; } // Naka-link sa Ingredient

        [Required]
        public DateTime SummaryDate { get; set; } // Ang petsa kung para saan ang summary na ito (e.g., '2025-09-20')

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal OpeningStock { get; set; } // Dami ng stock sa simula ng araw

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal TotalStockIn { get; set; } // Total na pumasok na stock (galing sa supplier)

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal TotalSold { get; set; } // Total na nabawas dahil sa benta

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal TotalWastage { get; set; } // Total na nasayang

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal TotalAdjusted { get; set; } // Total na in-adjust (manual count)

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal ClosingStock { get; set; } // Dami ng stock sa dulo ng araw

        [Required]
        [MaxLength(20)]
        public string UnitOfMeasure { get; set; } // Unit of measure para sa summary na ito

        // Navigation Property
        [ForeignKey("IngredientId")]
        public Ingredient Ingredient { get; set; }
    }
}
