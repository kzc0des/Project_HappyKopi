using System.ComponentModel.DataAnnotations;

namespace happykopiAPI.DTOs.Inventory
{
    public class StockItemBatchForCreateDto
    {
        [Required]
        public int StockItemId { get; set; }

        [Required]
        [Range(1, int.MaxValue)]
        public int QuantityAdded { get; set; }

        public DateTime? ExpirationDate { get; set; }
    }
}
