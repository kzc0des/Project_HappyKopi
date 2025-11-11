using happykopiAPI.Data;
using happykopiAPI.DTOs.Product.Incoming_Data;
using happykopiAPI.DTOs.Product.Outgoing_Data;
using happykopiAPI.Models;
using happykopiAPI.Services.Implementations;
using happykopiAPI.Services.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace happykopiAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly IProductService _productService;
        private readonly IImageService _imageService;
        private readonly ILogger<ProductsController> _logger;
        public ProductsController(IProductService productService, IImageService imageService, ILogger<ProductsController> logger)
        {
            _productService = productService;
            _imageService = imageService;
            _logger = logger;
        }

        [HttpGet("sizes")] 
        public async Task<IActionResult> GetActiveSizes()
        {
            var sizes = await _productService.GetActiveSizesAsync();
            return Ok(sizes);
        }

        [HttpGet("ingredients")]
        public async Task<IActionResult> GetActiveLiquidAndPowderStockItems()
        {
            var stockItems = await _productService.GetActiveLiquidAndPowderStockItemsAsync();
            return Ok(stockItems);
        }

        [HttpGet("addons")]
        public async Task<IActionResult> GetActiveAddOns()
        {
            var addOns = await _productService.GetActiveAddOnsAsync();
            return Ok(addOns);
        }

        [HttpGet("categories")]
        public async Task<IActionResult> GetActiveCategories()
        {
            var categories = await _productService.GetAllDrinkCategoriesAsync();
            return Ok(categories);
        }

        [HttpPost]
        public async Task<IActionResult> CreateProduct([FromForm] ProductCreateFormDto formDto)
        {
            // --- START DEBUG LOGGING ---
            _logger.LogInformation("--- CreateProduct Endpoint Na-Hit ---");

            // 1. Tignan natin kung ano ang na-bind sa DTO
            _logger.LogWarning("DTO 'formDto.Name' value: {Name}", formDto.Name);

            // 2. Tignan natin ang RAW FORM DATA
            _logger.LogWarning("--- Raw Request.Form Keys ---");
            foreach (var key in Request.Form.Keys)
            {
                _logger.LogWarning("Raw Key: {Key} | Raw Value: {Value}", key, Request.Form[key]);
            }
            _logger.LogWarning("--- End Raw Request.Form ---");
            // --- END DEBUG LOGGING ---

            if (formDto == null)
            {
                return BadRequest("Product data is missing.");
            }

            string imageUrl = string.Empty;
            string imagePublicId = string.Empty;

            if (formDto.ImageFile != null && formDto.ImageFile.Length > 0)
            {
                var uploadResult = await _imageService.AddImageAsync(formDto.ImageFile);
                if (uploadResult.Error != null)
                {
                    return BadRequest(uploadResult.Error.Message);
                }
                imageUrl = uploadResult.SecureUrl.ToString();
                imagePublicId = uploadResult.PublicId;
            }

            var variants = new List<ProductVariantCreateDto>();
            if (!string.IsNullOrEmpty(formDto.VariantsJson))
            {
                try
                {
                    variants = JsonConvert.DeserializeObject<List<ProductVariantCreateDto>>(formDto.VariantsJson);
                }
                catch (JsonException ex)
                {
                    return BadRequest($"Invalid variants JSON format: {ex.Message}");
                }
            }

            var productToCreate = new ProductCreateDto
            {
                Name = formDto.Name,
                Description = formDto.Description,
                CategoryId = formDto.CategoryId,
                IsActive = formDto.IsActive,
                IsAvailable = formDto.IsAvailable,
                ImageUrl = imageUrl, 
                ImagePublicId = imagePublicId, 
                Variants = variants 
            };

            try
            {
                int newProductId = await _productService.CreateProductAsync(productToCreate);
                return Ok(new { ProductId = newProductId });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetActiveProducts()
        {
            var products = await _productService.GetActiveProductsAsync();
            return Ok(products);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetProductDetail(int id)
        {
            var product = await _productService.GetProductDetailByIdAsync(id);
            if (product == null)
            {
                return NotFound();
            }
            return Ok(product);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateProduct(int id, [FromForm] ProductUpdateFormDto formDto)
        {
            if (formDto == null)
            {
                return BadRequest("Product data is missing.");
            }

            // Get existing product to check for image
            var existingProduct = await _productService.GetProductDetailByIdAsync(id);
            if (existingProduct == null)
            {
                return NotFound();
            }

            string imageUrl = existingProduct.ImageUrl;
            string imagePublicId = existingProduct.ImagePublicId;

            if (formDto.ImageFile != null && formDto.ImageFile.Length > 0)
            {
                // Delete old image if it exists
                if (!string.IsNullOrEmpty(existingProduct.ImagePublicId))
                {
                    await _imageService.DeleteImageAsync(existingProduct.ImagePublicId);
                }

                // Upload new image
                var uploadResult = await _imageService.AddImageAsync(formDto.ImageFile);
                if (uploadResult.Error != null)
                {
                    return BadRequest(uploadResult.Error.Message);
                }
                imageUrl = uploadResult.SecureUrl.ToString();
                imagePublicId = uploadResult.PublicId;
            }

            var variants = new List<ProductVariantCreateDto>();
            if (!string.IsNullOrEmpty(formDto.VariantsJson))
            {
                try
                {
                    variants = JsonConvert.DeserializeObject<List<ProductVariantCreateDto>>(formDto.VariantsJson);
                }
                catch (JsonException ex)
                {
                    return BadRequest($"Invalid variants JSON format: {ex.Message}");
                }
            }

            var productToUpdate = new ProductUpdateDto
            {
                Name = formDto.Name,
                Description = formDto.Description,
                CategoryId = formDto.CategoryId,
                IsActive = formDto.IsActive,
                IsAvailable = formDto.IsAvailable,
                ImageUrl = imageUrl,
                ImagePublicId = imagePublicId,
                Variants = variants
            };

            await _productService.UpdateProductAsync(id, productToUpdate);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProduct(int id)
        {
            await _productService.DeleteProductAsync(id);
            return NoContent();
        }
    }
}
