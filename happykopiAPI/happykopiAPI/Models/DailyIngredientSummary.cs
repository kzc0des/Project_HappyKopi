using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace happykopiAPI.Models
{
    public class DailyIngredientSummary
    {
        [Key]
        public long Id { get; set; } 

        [Required]
        public int IngredientId { get; set; } 

        [Required]
        public DateTime SummaryDate { get; set; } 

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal OpeningStock { get; set; } 

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal TotalStockIn { get; set; } 

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal TotalSold { get; set; } 

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal TotalWastage { get; set; }

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal TotalAdjusted { get; set; } 

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal ClosingStock { get; set; } 

        [Required]
        [MaxLength(20)]
        public string UnitOfMeasure { get; set; } 

        [ForeignKey("IngredientId")]
        public Ingredient Ingredient { get; set; }
    }
}
