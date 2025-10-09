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
            var loginResponse = await _authService.Login(userForLoginDto);
            if (loginResponse == null)
            {
                return Unauthorized("Invalid username or password");
            }
            return Ok(loginResponse);
        }

        [HttpPost("register")]
        public async Task<ActionResult<UserDto>> Register(UserForRegisterDto userForRegisterDto)
        {
            var user = await _authService.Register(userForRegisterDto);
            if (user == null)
            {
                return BadRequest("Username already exists");
            }
            return Ok(user);
        }
    }
}
