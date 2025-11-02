using happykopiAPI.Data;
using happykopiAPI.DTOs.Product.Incoming_Data;
using happykopiAPI.Models;
using happykopiAPI.Services.Implementations;
using happykopiAPI.Services.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
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
        public ProductsController(IProductService productService, IImageService imageService)
        {
            _productService = productService;
            _imageService = imageService;
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
    }
}
