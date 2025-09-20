using System.ComponentModel.DataAnnotations.Schema;

namespace happykopiAPI.Models
{
    public class ProductIngredient
    {
        public int ProductId { get; set; }
        public int IngredientId { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal QuantityNeeded { get; set; } 

        public Product Product { get; set; }
        public Ingredient Ingredient { get; set; }
    }
}
