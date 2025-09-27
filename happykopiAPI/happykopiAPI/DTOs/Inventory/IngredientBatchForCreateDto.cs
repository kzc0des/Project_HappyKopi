using System.ComponentModel.DataAnnotations;

namespace happykopiAPI.DTOs.Inventory
{
    public class IngredientBatchForCreateDto
    {
        [Required]
        public int IngredientId { get; set; }

        [Required]
        [StringLength(50, ErrorMessage = "Ang Batch Number ay hindi maaaring lumagpas sa 50 characters.")]
        public string BatchNumber { get; set; }

        [Required]
        [Range(1, int.MaxValue, ErrorMessage = "Ang quantity ay dapat hindi bababa sa 1.")]
        public int Quantity { get; set; }

        [Required]
        public DateTime PurchaseDate { get; set; }

        public DateTime? ExpirationDate { get; set; }
    }
}
