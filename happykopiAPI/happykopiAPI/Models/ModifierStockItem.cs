using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace happykopiAPI.Models
{
    public class ModifierStockItem
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int ModifierId { get; set; }

        [ForeignKey("ModifierId")]
        public Modifier Modifier { get; set; }

        [Required]
        public int StockItemId { get; set; }

        [ForeignKey("StockItemId")]
        public StockItem StockItem { get; set; }

        [Required]
        [Column(TypeName = "decimal(18, 2)")]
        public decimal QuantityNeeded { get; set; }
    }
}
