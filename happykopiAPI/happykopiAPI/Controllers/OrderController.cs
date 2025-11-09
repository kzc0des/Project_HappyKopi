using happykopiAPI.Services.Implementations;
using happykopiAPI.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System;

namespace happykopiAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]

    public class OrderController : ControllerBase
    {
        private readonly IOrderService _orderService;

        public OrderController(IOrderService orderService)
        {
            _orderService = orderService;
        }

        [HttpGet]
        public async Task<IActionResult> GetCategories()
        {
            var categories = await _orderService.GetCategoriesWithProductCountAsync();
            return Ok(categories);
        }
    }

}