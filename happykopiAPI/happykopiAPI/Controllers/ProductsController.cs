using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using happykopiAPI.Data;
using happykopiAPI.Models;
using happykopiAPI.Services.Interfaces;

namespace happykopiAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly IProductService _productService;
        public ProductsController(IProductService productService)
        {
            _productService = productService;
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
    }
}
