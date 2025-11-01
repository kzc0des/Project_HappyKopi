using happykopiAPI.Data;
using happykopiAPI.DTOs.Category.Incoming_Data;
using happykopiAPI.Models;
using happykopiAPI.Services.Implementations;
using happykopiAPI.Services.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace happykopiAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoriesController : ControllerBase
    {
        private readonly ICategoryService _categoryService;

        public CategoriesController(ICategoryService categoryService)
        {
            _categoryService = categoryService;
        }

        [HttpGet]
        public async Task<IActionResult> GetCategories()
        {
            var categories = await _categoryService.GetCategoriesWithProductCountAsync();
            return Ok(categories);
        }

        [HttpGet("assign/{categoryId}")]
        public async Task<IActionResult> GetCategoriesWithProducts(int categoryId)
        {
            try
            {
                var productsByCategory = await _categoryService.GetActiveProductsByCategoryIdAsync(categoryId);
                return Ok(productsByCategory);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);

            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetCategory(int id)
        {
            var category = await _categoryService.GetCategoryByIdAsync(id);
            if (category == null)
            {
                return NotFound();
            }
            return Ok(category);
        }

        [HttpPost]
        public async Task<IActionResult> CreateCategory([FromBody] CategoryForCreateUpdateDto categoryForCreate)
        {
            try
            {
                if (categoryForCreate == null)
                {
                    return BadRequest();
                }

                await _categoryService.CreateCategoryAsync(categoryForCreate);

                return Ok(new { message = "Category created successfully" });
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);

            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCategory(int id, [FromBody] CategoryForCreateUpdateDto categoryForUpdate)
        {
            try
            {
                if (categoryForUpdate == null)
                {
                    return BadRequest();
                }

                await _categoryService.UpdateCategoryAsync(id, categoryForUpdate);
                return Ok(new { message = "Category updated successfully." });
            }catch (Exception ex) 
            { 
                return BadRequest(ex.Message); 
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCategory(int id)
        {
            var result = await _categoryService.DeleteCategoryAsync(id);
            if (!result)
            {
                return NotFound();
            }

            return NoContent();
        }
    }
}
