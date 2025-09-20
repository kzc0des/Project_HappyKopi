using System.ComponentModel.DataAnnotations;

namespace happykopiAPI.DTOs.Product
{
    public class CategoryDto
    {
        public int Id { get; set; }
        [Required]
        public string Name { get; set; }
    }
}
