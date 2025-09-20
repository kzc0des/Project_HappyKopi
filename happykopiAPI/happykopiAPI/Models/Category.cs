using System.ComponentModel.DataAnnotations;

namespace happykopiAPI.Models
{
    public class Category
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(100)]
        public string Name { get; set; } // Hal. "Hot Coffees", "Iced Coffees", "Pastries"

        // Navigation Property: Isang category ay pwedeng magkaroon ng maraming produkto
        public ICollection<Product> Products { get; set; }
    }
}
