using happykopiAPI.Enums;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace happykopiAPI.Models
{
    public class StockItem
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

        [Required]
        public StockItemType ItemType { get; set; }
        public ICollection<ProductIngredient> Recipe { get; set; }
        public ICollection<StockItemBatch> Batches { get; set; }
        public ICollection<StockLog> StockLogs { get; set; }
        public ICollection<AddOnIngredient> AddOnRecipes { get; set; }
    }
}
