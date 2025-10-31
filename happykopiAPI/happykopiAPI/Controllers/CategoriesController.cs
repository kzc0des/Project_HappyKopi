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

        [HttpGet("{id}", Name = "GetCategory")]
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
            if (categoryForCreate == null)
            {
                return BadRequest();
            }

            var createdCategory = await _categoryService.CreateCategoryAsync(categoryForCreate);

            return CreatedAtRoute("GetCategory", new { id = createdCategory.Id }, createdCategory);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCategory(int id, [FromBody] CategoryForCreateUpdateDto categoryForUpdate)
        {
            if (categoryForUpdate == null)
            {
                return BadRequest();
            }

            var updatedCategory = await _categoryService.UpdateCategoryAsync(id, categoryForUpdate);
            if (updatedCategory == null)
            {
                return NotFound(); 
            }

            return NoContent();
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
