using happykopiAPI.DTOs.Inventory;
using happykopiAPI.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using System.Security.Claims;

namespace happykopiAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StockItemsController : ControllerBase
    {
        private readonly IStockItemService _stockItemService;

        public StockItemsController(IStockItemService stockItemService)
        {
            _stockItemService = stockItemService;
        }

        [HttpPost("stock-items")]
        public async Task<IActionResult> CreateStockItem([FromBody] StockItemForCreateDto dto)
        {
            try
            {
                /* will be removed later
                var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
                if (string.IsNullOrEmpty(userIdString))
                {
                    return Unauthorized("User ID not found in token.");
                }

                dto.UserId = int.Parse(userIdString);
                */

                await _stockItemService.AddNewStockItemAsync(dto);
                return Ok(new { message = "Stock item created successfully." });
            }
            catch (SqlException ex) when (ex.Number == 50001)
            {
                return Conflict(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An internal error occurred: {ex.Message}");
            }
        }

        [HttpPost("stock-items/batches")]
        public async Task<IActionResult> AddStockBatch([FromBody] StockItemBatchForCreateDto dto)
        {
            try
            {
                /* will be removed later
                var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
                if (string.IsNullOrEmpty(userIdString))
                {
                    return Unauthorized("User ID not found in token.");
                }

                dto.UserId = int.Parse(userIdString);
                */

                await _stockItemService.AddStockItemBatchAsync(dto);
                return Ok(new { message = "Stock batch added successfully." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An internal error occurred: {ex.Message}");
            }
        }

        [HttpGet("stock-items")]
        public async Task<IActionResult> GetAllStockItems()
        {
            try
            {
                var items = await _stockItemService.GetAllStockItemsAsync();
                return Ok(items);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An internal error occurred: {ex.Message}");
            }
        }

        [HttpGet("stock-items/{id}")]
        public async Task<IActionResult> GetStockItem(int id)
        {
            try
            {
                var item = await _stockItemService.GetStockItemByIdAsync(id);
                if (item == null)
                {
                    return NotFound();
                }
                return Ok(item);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An internal error occurred: {ex.Message}");
            }
        }

        [HttpGet("stock-items/{stockItemId}/batches")]
        public async Task<IActionResult> GetStockItemBatches(int stockItemId)
        {
            try
            {
                var batches = await _stockItemService.GetBatchesByStockItemIdAsync(stockItemId);
                return Ok(batches);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An internal error occurred: {ex.Message}");
            }
        }

        [HttpGet("stock-items/low-stock")]
        public async Task<IActionResult> GetLowStockItems()
        {
            try
            {
                var items = await _stockItemService.GetLowStockItemsAsync();
                return Ok(items);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An internal error occurred: {ex.Message}");
            }
        }

        [HttpGet("stock-items/count-by-itemtype")]
        public async Task<IActionResult> GetStockItemCountByItemType()
        {
            try
            {
                var result = await _stockItemService.GetStockItemCountByItemTypeAsync();
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An internal error occurred: {ex.Message}");
            }
        }

        [HttpPut("stock-items/{id}")]
        public async Task<IActionResult> UpdateStockItem(int id, [FromBody] StockItemUpdateDto dto)
        {
            try
            {
                /* will be removed later
                var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
                if (string.IsNullOrEmpty(userIdString))
                {
                    return Unauthorized("User ID not found in token.");
                }

                dto.UserId = int.Parse(userIdString);
                */

                await _stockItemService.UpdateStockItemAsync(id, dto);
                return Ok(new { message = "Stock item updated successfully." });
            }
            catch (SqlException ex) when (ex.Number == 50002) 
            {
                return Conflict(new { message = ex.Message }); 
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An internal error occurred: {ex.Message}");
            }
        }

        [HttpPost("stock-items/batches/adjust")]
        public async Task<IActionResult> AdjustStockBatchQuantity([FromBody] StockAdjustmentDto dto)
        {
            try
            {
                /* will be removed later
                var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
                if (string.IsNullOrEmpty(userIdString))
                {
                    return Unauthorized("User ID not found in token.");
                }

                dto.UserId = int.Parse(userIdString);
                */

                await _stockItemService.AdjustStockQuantityAsync(dto);
                return Ok(new { message = "Stock quantity adjusted successfully." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An internal error occurred: {ex.Message}");
            }
        }

        [HttpDelete("stock-items/{id}")]
        public async Task<IActionResult> DeactivateStockItem(int id)
        {
            try
            {
                var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
                if (string.IsNullOrEmpty(userIdString))
                {
                    return Unauthorized();
                }

                var userId = int.Parse(userIdString);

                await _stockItemService.DeactivateStockItemAsync(id, userId);

                return Ok(new { message = "Stock item has been deactivated." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An internal error occurred: {ex.Message}");
            }
        }
    }
}
