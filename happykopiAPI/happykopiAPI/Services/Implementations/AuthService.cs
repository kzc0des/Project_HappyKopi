using happykopiAPI.DTOs.Auth;
using happykopiAPI.Services.Interfaces;
using Microsoft.Data.SqlClient;
using Microsoft.IdentityModel.Tokens;
using System.Data;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Dapper;

namespace happykopiAPI.Services.Implementations
{
    public class AuthService : IAuthService
    {
        private readonly SymmetricSecurityKey _key;
        private readonly string _issuer;
        private readonly string _connectionString;
        public AuthService(IConfiguration config)
        {
            _key = new SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes(config["Jwt:Key"]));
            _issuer = config["Jwt:Issuer"];
            _connectionString = config.GetConnectionString("LocalDB");
        }
        public string GenerateJwtToken(UserDto user)
        {
            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.NameId, user.Id.ToString()),
                new Claim(JwtRegisteredClaimNames.UniqueName, user.Username.ToString()),
                new Claim(ClaimTypes.Role, user.Role.ToString())
            };

            var credentials = new SigningCredentials(_key, SecurityAlgorithms.HmacSha512Signature);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.Now.AddDays(1),
                SigningCredentials = credentials,
                Issuer = _issuer
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
        public async Task<LoginResponseDto> Login(UserForLoginDto userForLoginDto)
        {
            await using var connection = new SqlConnection(_connectionString);
            var user = await GetUserByUsername(userForLoginDto.Username, connection);

            if (user == null)
            {
                throw new InvalidOperationException("Invalid username or password");
            }

            bool isPasswordValid = BCrypt.Net.BCrypt.Verify(userForLoginDto.Password, user.PasswordHash);

            if (!isPasswordValid)
            {
                return null;
            }

            return new LoginResponseDto
            {
                Token = GenerateJwtToken(user),
                User = user
            };
        }

        private async Task<UserDto> GetUserByUsername(string username, SqlConnection connection)
        {
            var result = await connection.QueryFirstOrDefaultAsync<UserDto>(
                "sp_UserAuthenticate",
                new { Username = username },
                commandType: CommandType.StoredProcedure);
            return result;
        }
        public async Task<UserDto> Register(UserForRegisterDto userForRegisterDto)
        {
            await using var connection = new SqlConnection(_connectionString);
            var passwordHash = BCrypt.Net.BCrypt.HashPassword(userForRegisterDto.Password);
            string fullName = $"{userForRegisterDto.FirstName} {userForRegisterDto.LastName}";

            var parameters = new DynamicParameters();
            parameters.Add("@Username", userForRegisterDto.Username);
            parameters.Add("@PasswordHash", passwordHash);
            parameters.Add("@EmailAddress", userForRegisterDto.EmailAddress);
            parameters.Add("@PhoneNumber", userForRegisterDto.PhoneNumber);
            parameters.Add("@FirstName", userForRegisterDto.FirstName);
            parameters.Add("@LastName", userForRegisterDto.LastName);

            try
            {
                await connection.ExecuteAsync(
                    "sp_UserRegister",
                    parameters,
                    commandType: CommandType.StoredProcedure);
                var newUser = await GetUserByUsername(userForRegisterDto.Username, connection);
                return newUser;
            }
            catch (SqlException ex)
            {
                throw new InvalidOperationException(ex.Message);
            }
        }

        public async Task<UserDto> RegisterAdminForTesting(UserForRegisterDto userForAdminRegisterDto)
        {
            await using var connection = new SqlConnection(_connectionString);
            var passwordHash = BCrypt.Net.BCrypt.HashPassword(userForAdminRegisterDto.Password);

            var parameters = new DynamicParameters();
            parameters.Add("@Username", userForAdminRegisterDto.Username);
            parameters.Add("@PasswordHash", passwordHash);
            parameters.Add("@EmailAddress", userForAdminRegisterDto.EmailAddress);
            parameters.Add("@PhoneNumber", userForAdminRegisterDto.PhoneNumber);
            parameters.Add("@FirstName", userForAdminRegisterDto.FirstName);
            parameters.Add("@LastName", userForAdminRegisterDto.LastName);

            try
            {
                await connection.ExecuteAsync(
                    "dbo.sp_RegisterAdminForTesting",
                    parameters,
                    commandType: CommandType.StoredProcedure);

                var newUser = await GetUserByUsername(userForAdminRegisterDto.Username, connection);
                return newUser;
            }
            catch (SqlException ex)
            {
                throw new InvalidOperationException(ex.Message);
            }
        }
    }
}
