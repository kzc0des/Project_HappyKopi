using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace happykopiAPI.Models
{
    public class ProductVariantIngredient
    {
        [Key, Column(Order = 0)]
        public int ProductVariantId { get; set; }

        [Key, Column(Order = 1)]
        public int StockItemId { get; set; }

        [ForeignKey("ProductVariantId")]
        public ProductVariant ProductVariant { get; set; }

        [ForeignKey("StockItemId")]
        public StockItem StockItem { get; set; }

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal QuantityNeeded { get; set; }
    }
}
