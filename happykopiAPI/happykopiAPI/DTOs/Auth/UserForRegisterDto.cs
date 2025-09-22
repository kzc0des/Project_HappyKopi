using happykopiAPI.Enums;
using System.ComponentModel.DataAnnotations;

namespace happykopiAPI.DTOs.Auth
{
    public class UserForRegisterDto
    {
        [Required]
        [StringLength(50, MinimumLength = 4)]
        public string Username { get; set; }

        [Required]
        [StringLength(20, MinimumLength = 8)]
        public string Password { get; set; }

        [Required]
        public string FirstName { get; set; }

        [Required]
        public string LastName { get; set; }

    }
}
