using System.ComponentModel.DataAnnotations.Schema;

namespace happykopiAPI.Models
{
    public class ProductIngredient
    {
        // Composite Primary Key (ProductId, IngredientId)
        // Itatakda ito gamit ang Fluent API sa AppDbContext
        public int ProductId { get; set; }
        public int IngredientId { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal QuantityNeeded { get; set; } // Dami ng ingredient na kailangan

        // Navigation Properties para madaling i-access ang related data
        public Product Product { get; set; }
        public Ingredient Ingredient { get; set; }
    }
}
