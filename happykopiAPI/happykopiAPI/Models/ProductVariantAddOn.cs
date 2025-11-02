using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace happykopiAPI.Models
{
    public class ProductVariantAddOn
    {
        public int ProductVariantId { get; set; }
        public int ModifierId { get; set; }

        [Required]
        public int DefaultQuantity { get; set; }

        [ForeignKey("ProductVariantId")]
        public ProductVariant ProductVariant { get; set; }

        [ForeignKey("ModifierId")]
        public Modifier Modifier { get; set; }
    }
}
