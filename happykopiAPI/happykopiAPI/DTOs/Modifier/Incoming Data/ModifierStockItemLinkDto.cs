using System.ComponentModel.DataAnnotations;

namespace happykopiAPI.DTOs.Modifier.Incoming_Data
{
    public class ModifierStockItemLinkDto
    {
        [Required]
        public int StockItemId { get; set; }

        [Required]
        [Range(0.01, double.MaxValue)]
        public decimal QuantityNeeded { get; set; }
    }
}
