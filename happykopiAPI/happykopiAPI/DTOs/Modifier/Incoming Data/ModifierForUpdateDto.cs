using happykopiAPI.Enums;
using System.ComponentModel.DataAnnotations;

namespace happykopiAPI.DTOs.Modifier.Incoming_Data
{
    public class ModifierForUpdateDto
    {
        [Required]
        [MaxLength(100)]
        public string Name { get; set; }

        [Required]
        [Range(0, 999999.99)]
        public decimal Price { get; set; }

        [Required]
        public ModifierType Type { get; set; }

        [Required]
        public bool IsAvailable { get; set; }
    }
}
