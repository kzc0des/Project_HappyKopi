using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace happykopiAPI.Models
{
    public class StockItemBatch
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int StockItemId { get; set; }

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal StockQuantity { get; set; }

        [Required]
        public DateTime DateReceived { get; set; }

        public DateTime? ExpiryDate { get; set; }

        public DateTime? DateUsed { get; set; }

        public StockItem StockItem { get; set; }
        public ICollection<StockLog> StockLogs { get; set; }
    }
}
