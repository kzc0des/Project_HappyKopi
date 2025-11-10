using happykopiAPI.Enums;
using happykopiAPI.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace happykopiAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrderController : ControllerBase
    {
        private readonly IOrderService _orderService;

        public OrderController(IOrderService orderService)
        {
            _orderService = orderService;
        }
         
        [HttpGet("categories")]
        public async Task<IActionResult> GetCategoriesAsync()
        {
            var categories = await _orderService.GetCategoriesWithProductCountAsync();
            return Ok(categories);
        }
         
        [HttpGet("categories/{categoryId}/products")]
        public async Task<IActionResult> GetProductsByCategoryAsync(int categoryId)
        {
            var products = await _orderService.GetProductsWithCategoriesAsync(categoryId);
            return Ok(products);
        }
         
        [HttpGet("modifiers")]
        public async Task<IActionResult> GetModifiersAsync(
            [FromQuery] ModifierType? modifierType = null,
            [FromQuery] bool availableOnly = false)
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
        public async Task<IActionResult> GetModifierCountsAsync()
        {
            var counts = await _orderService.GetModifierCountByTypeAsync();
            return Ok(counts);
        }
    }
}
