using System.ComponentModel.DataAnnotations;

namespace happykopiAPI.DTOs.Auth
{
    public class UserForLoginDto
    {
        [Required]
        public string Username { get; set; }

        [Required]
        public string Password { get; set; }
    }
}
