using System.ComponentModel.DataAnnotations;

namespace happykopiAPI.DTOs.Inventory
{
    public class IngredientBatchDto
    {
        public int Id { get; set; }

        [Required]
        public int IngredientId { get; set; }

        [Required]
        [StringLength(50)]
        public string BatchNumber { get; set; }

        [Required]
        [Range(0, int.MaxValue)]
        public int Quantity { get; set; }

        [Required]
        public DateTime PurchaseDate { get; set; }

        public DateTime? ExpirationDate { get; set; }
    }
}
