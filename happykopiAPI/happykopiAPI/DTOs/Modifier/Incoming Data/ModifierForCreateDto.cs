using happykopiAPI.Enums;
using System.ComponentModel.DataAnnotations;

namespace happykopiAPI.DTOs.Modifier.Incoming_Data
{
    public class ModifierForCreateDto
    {
        [Required]
        [MaxLength(100)]
        public string Name { get; set; }

        [Required]
        [Range(1, double.MaxValue)]
        public decimal Price { get; set; }

        [Required]
        public ModifierType Type { get; set; }
    }
}
