using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace happykopiAPI.Models
{
    public class Product
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(150)]
        public string Name { get; set; } 

        public string Description { get; set; }

        public string ImageUrl { get; set; } 
        public string ImagePublicId { get; set; }

        [Required]
        public bool IsAvailable { get; set; }

        [Required]
        public bool IsActive { get; set; }

        [Required]
        public int CategoryId { get; set; }

        [ForeignKey("CategoryId")]
        public Category Category { get; set; }

        public ICollection<ProductVariant> Variants { get; set; }
    }
}
