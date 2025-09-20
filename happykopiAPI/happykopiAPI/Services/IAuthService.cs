using happykopiAPI.DTOs.Auth;

namespace happykopiAPI.Services
{
    public interface IAuthService
    {
        Task<UserDto> Register(UserForRegisterDto userForRegisterDto);
        Task<LoginResponseDto> Login(UserForLoginDto userForLoginDto);
        Task<bool> UserExists(string username);
    }
}
