using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace happykopiAPI.Models
{
    public class ProductVariantAddOn
    {
        [Key, Column(Order = 0)]
        public int ProductVariantId { get; set; }

        [Key, Column(Order = 1)]
        public int ModifierId { get; set; }

        [Required]
        public int DefaultQuantity { get; set; }

        [ForeignKey("ProductVariantId")]
        public ProductVariant ProductVariant { get; set; }

        [ForeignKey("ModifierId")]
        public Modifier Modifier { get; set; }
    }
}
