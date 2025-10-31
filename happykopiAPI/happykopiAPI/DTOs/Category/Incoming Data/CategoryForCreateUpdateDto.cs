using System.ComponentModel.DataAnnotations;

namespace happykopiAPI.DTOs.Category.Incoming_Data
{
    public class CategoryForCreateUpdateDto
    {
        [Required]
        [MaxLength(100)]
        public string Name { get; set; }
    }
}
