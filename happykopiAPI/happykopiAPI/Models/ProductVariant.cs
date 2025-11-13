using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace happykopiAPI.Models
{
    public class ProductVariant
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int ProductId { get; set; }

        [ForeignKey("ProductId")]
        public Product Product { get; set; }

        public int? SizeId { get; set; }

        [ForeignKey("SizeId")]
        public Modifier Size { get; set; }

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal Price { get; set; }

        public ICollection<ProductVariantIngredient> Recipe { get; set; }
        public ICollection<ProductVariantAddOn> AvailableAddOns { get; set; }
    }
}
