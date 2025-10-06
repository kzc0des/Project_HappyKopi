using happykopiAPI.Enums;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace happykopiAPI.Models
{
    public class StockLog
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int StockItemId { get; set; }

        [Required]
        public int BatchId { get; set; }

        [Required]
        public int UserId { get; set; } 

        [Required]
        public StockLogType ChangeType { get; set; } 

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal QuantityChanged { get; set; } 

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal StockQuantityBefore { get; set; } 

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal StockQuantityAfter { get; set; } 

        [MaxLength(255)]
        public string Remarks { get; set; }

        public DateTime DateLogged { get; set; } 

        [ForeignKey("IngredientId")]
        public StockItem StockItem { get; set; }

        [ForeignKey("BatchId")]
        public StockItemBatch Batch { get; set; }

        [ForeignKey("UserId")]
        public User User { get; set; }
    }
}
