using happykopiAPI.Enums;
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

        [HttpGet()]
        public async Task<IActionResult> GetCategories()
        {
            var categories = await _orderService.GetCategoriesWithProductCountAsync();
            return Ok(categories);
        }

        [HttpGet("category/{categoryId}")]
        public async Task<IActionResult> GetProductsByCategory(int categoryId)
        {
            var products = await _orderService.GetProductsWithCategoriesAsync(categoryId);
            return Ok(products);
        }

        [HttpGet("modifiers")]
        public async Task<IActionResult> GetModifiers([FromQuery] ModifierType? modifierType = null, [FromQuery] bool availableOnly = false)
        {
            if (modifierType.HasValue)
            {
                var modifiersByType = await _orderService.GetModifiersByTypeAsync(modifierType.Value);
                return Ok(modifiersByType);
            }

            var modifiers = availableOnly
                ? await _orderService.GetAvailableModifiersAsync()
                : await _orderService.GetAllModifiersAsync();

            return Ok(modifiers);
        }

        [HttpGet("modifiers/count-by-type")]
        public async Task<IActionResult> GetModifierCounts()
        {
            var counts = await _orderService.GetModifierCountByTypeAsync();
            return Ok(counts);
        }

        

    }

}