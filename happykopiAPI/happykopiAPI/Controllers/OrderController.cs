using happykopiAPI.Enums;
using happykopiAPI.Services.Interfaces;
using happykopiAPI.DTOs.Order.Ingoing_Data;
using happykopiAPI.DTOs.Order.Outgoing_Data;
using Microsoft.AspNetCore.Mvc;

namespace happykopiAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrderController : ControllerBase
    {
        private readonly IOrderService _orderService;
        private readonly INotificationService _notificationService;

        public OrderController(IOrderService orderService, INotificationService notificationService)
        {
            _orderService = orderService;
            _notificationService = notificationService;
        }

        [HttpPost]
        public async Task<IActionResult> CreateOrder([FromBody] NewOrderRequestDto request)
        {
            try
            {
                if (request.UserId <= 0)
                    return BadRequest(new NewOrderErrorDto
                    {
                        Message = "Invalid user ID",
                        Errors = new List<string> { "User ID must be greater than zero" }
                    });

                if (request.OrderItems == null || request.OrderItems.Count == 0)
                    return BadRequest(new NewOrderErrorDto
                    {
                        Message = "Invalid order",
                        Errors = new List<string> { "Order must contain at least one item" }
                    });

                if (request.TotalAmount <= 0)
                    return BadRequest(new NewOrderErrorDto
                    {
                        Message = "Invalid total amount",
                        Errors = new List<string> { "Total amount must be greater than zero" }
                    });

                if (request.AmountPaid < request.TotalAmount)
                    return BadRequest(new NewOrderErrorDto
                    {
                        Message = "Insufficient payment",
                        Errors = new List<string> { $"Amount paid ({request.AmountPaid:C}) is less than total amount ({request.TotalAmount:C})" }
                    });

                var result = await _orderService.CreateOrderAsync(request);

                await _notificationService.NotifyTransactionUpdatedAsync();

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new NewOrderErrorDto
                {
                    Message = "An error occurred while creating the order",
                    Errors = new List<string> { ex.Message }
                });
            }
        }

        [HttpGet]
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

        // NEW ENDPOINT: Get Product Availability
        [HttpGet("availability")]
        public async Task<IActionResult> GetProductAvailability([FromQuery] int? categoryId = null)
        {
            try
            {
                var availability = await _orderService.GetProductAvailabilityAsync(categoryId);
                return Ok(availability);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    Message = "Error checking product availability",
                    Error = ex.Message
                });
            }
        }

        [HttpGet("modifiers")]
        public async Task<IActionResult> GetModifiers(
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
        public async Task<IActionResult> GetModifierCounts()
        {
            var counts = await _orderService.GetModifierCountByTypeAsync();
            return Ok(counts);
        }

        [HttpGet("configuration/{productId}")]
        public async Task<IActionResult> GetProductConfiguration(int productId)
        {
            if (productId <= 0)
            {
                return BadRequest("Product ID must be greater than zero.");
            }

            var configuration = await _orderService.GetProductConfigurationByIdAsync(productId);

            if (configuration == null || configuration.Variants.Count == 0)
            {
                return NotFound($"Product with ID {productId} not found or has no variants.");
            }

            return Ok(configuration);
        }
    }
}