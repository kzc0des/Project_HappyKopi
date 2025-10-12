using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using happykopiAPI.Data;
using happykopiAPI.Models;
using happykopiAPI.DTOs.Auth;
using happykopiAPI.Services.Interfaces;

namespace happykopiAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly HappyKopiDbContext _context;

        public UsersController(HappyKopiDbContext context, IAuthService authService)
        {
            _authService = authService;
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<User>>> GetUsers()
        {
            return await _context.Users.ToListAsync();
        }

        [HttpPost("LoginUser")]
        public async Task<ActionResult<LoginResponseDto>> Login(UserForLoginDto userForLoginDto)
        {
            try
            {
                var loginResponse = await _authService.Login(userForLoginDto);
                return Ok(loginResponse);
            }
            catch (InvalidOperationException ex)
            {
                return Unauthorized("Invalid username or password");
            }            
        }

        [HttpPost("register")]
        public async Task<ActionResult<UserDto>> Register(UserForRegisterDto userForRegisterDto)
        {
            try
            {
                var user = await _authService.Register(userForRegisterDto);
                return Ok(user);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("register/admin")]
        public async Task<ActionResult<UserDto>> RegisterAdmin(UserForRegisterDto userForAdminRegisterDto)
        {
            try
            {
                var user = await _authService.RegisterAdminForTesting(userForAdminRegisterDto);
                return Ok(user);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
