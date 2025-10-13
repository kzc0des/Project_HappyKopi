using System.ComponentModel.DataAnnotations;

namespace happykopiAPI.DTOs.Inventory
{
    public class StockAdjustmentDto
    {
        [Required]
        public int StockItemBatchId { get; set; }

        [Required]
        [Range(0, double.MaxValue)]
        public decimal NewQuantity { get; set; }

        [Required]
        public int UserId { get; set; }

        [Required]
        [StringLength(255)]
        public string? Remarks { get; set; }
    }
}
