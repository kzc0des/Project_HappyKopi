using happykopiAPI.Enums;
using System.ComponentModel.DataAnnotations;

namespace happykopiAPI.Models
{
    public class User
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(50)]
        public string Username { get; set; }

        [Required]
        public string PasswordHash { get; set; }

        [Required]
        public string FullName { get; set; }

        [Required]
        public UserRole Role { get; set; }

        public DateTime DateCreated { get; set; } = DateTime.UtcNow;
    }
}
