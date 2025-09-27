using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace happykopiAPI.Models
{
    public class AddOnIngredient
    {
        public int AddOnId { get; set; }
        public int IngredientId { get; set; }

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal QuantityNeeded { get; set; } 
        public AddOn AddOn { get; set; }
        public Ingredient Ingredient { get; set; }
    }
}
