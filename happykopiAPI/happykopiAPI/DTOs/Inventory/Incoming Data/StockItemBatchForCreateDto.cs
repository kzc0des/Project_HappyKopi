using System.ComponentModel.DataAnnotations;

namespace happykopiAPI.DTOs.Inventory
{
    public class StockItemBatchForCreateDto
    {
        [Required]
        public int StockItemId { get; set; }

        [Required]
        [Range(0.01, double.MaxValue, ErrorMessage = "Quantity must be greater than zero.")]
        public decimal QuantityAdded { get; set; }

        [Required]
        public int UserId { get; set; }

        public DateTime? ExpiryDate { get; set; }

        [StringLength(255)]
        public string? Remarks { get; set; }
    }
}
