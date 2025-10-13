using System.ComponentModel.DataAnnotations;

namespace happykopiAPI.DTOs.Inventory
{
    public class StockItemUpdateDto
    {
        [Required]
        [StringLength(255)]
        public string Name { get; set; }

        [Required]
        [StringLength(50)]
        public string Unit { get; set; }

        [Required]
        [Range(0, double.MaxValue)]
        public decimal AlertLevel { get; set; }

        [Required]
        public bool IsPerishable { get; set; }

        [Required]
        public int ItemType { get; set; }

        [Required]
        public int UserId { get; set; }
    }
}
