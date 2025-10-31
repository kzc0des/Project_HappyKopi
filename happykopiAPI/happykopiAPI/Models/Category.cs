using System.ComponentModel.DataAnnotations;

namespace happykopiAPI.Models
{
    public class Category
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(100)]
        public string Name { get; set; } 

        [Required]
        public bool IsActive { get; set; }

        public ICollection<Product> Products { get; set; }
    }
}
