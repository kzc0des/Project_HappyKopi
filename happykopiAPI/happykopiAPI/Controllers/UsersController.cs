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

namespace happykopiAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly HappyKopiDbContext _context;

        public UsersController(HappyKopiDbContext context)
        {
            _context = context;
        }

    }
}
