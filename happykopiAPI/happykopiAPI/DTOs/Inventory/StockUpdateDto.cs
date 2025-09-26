using System.ComponentModel.DataAnnotations;

namespace happykopiAPI.DTOs.Inventory
{
    public class StockUpdateDto
    {
        [Required]
        [Range(0.01, double.MaxValue)]
        public decimal Quantity { get; set; }

        [Required]
        public DateTime? ExpiryDate { get; set; }
        public string? Remarks { get; set; }
    }
}
