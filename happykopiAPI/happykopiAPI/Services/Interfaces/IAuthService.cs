using happykopiAPI.DTOs.Auth;

namespace happykopiAPI.Services.Interfaces
{
    public interface IAuthService
    {
        Task<UserDto> Register(UserForRegisterDto userForRegisterDto);
        Task<UserDto> RegisterAdminForTesting(UserForRegisterDto userForAdminRegisterDto);
        Task<LoginResponseDto> Login(UserForLoginDto userForLoginDto);
        string GenerateJwtToken(UserDto user);

    }
}
