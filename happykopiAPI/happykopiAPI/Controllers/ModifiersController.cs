using happykopiAPI.Data;
using happykopiAPI.DTOs.Modifier.Incoming_Data;
using happykopiAPI.Enums;
using happykopiAPI.Models;
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
    public class ModifiersController : ControllerBase
    {
        private readonly IModifierService _modifierService;

        public ModifiersController(IModifierService modifierService)
        {
            _modifierService = modifierService;
        }

        [HttpGet("count-by-type")]
        public async Task<IActionResult> GetModifierCounts()
        {
            var counts = await _modifierService.GetModifierCountByTypeAsync();
            return Ok(counts);
        }

        [HttpGet]
        public async Task<IActionResult> GetModifiers([FromQuery] ModifierType? modifierType = null, [FromQuery] bool availableOnly = false)
        {
            if (modifierType.HasValue)
            {
                var modifiersByType = await _modifierService.GetModifiersByTypeAsync(modifierType.Value);
                return Ok(modifiersByType);
            }

            var modifiers = availableOnly
                ? await _modifierService.GetAvailableModifiersAsync()
                : await _modifierService.GetAllModifiersAsync();

            return Ok(modifiers);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetModifier(int id)
        {
            var modifier = await _modifierService.GetModifierByIdAsync(id);

            if (modifier == null)
            {
                return NotFound();
            }

            return Ok(modifier);
        }

        [HttpPost]
        public async Task<IActionResult> CreateModifier([FromBody] ModifierForCreateDto modifierForCreateDto)
        {
            var modifier = await _modifierService.CreateModifierAsync(modifierForCreateDto);
            return CreatedAtAction(nameof(GetModifier), new { id = modifier.Id }, modifier);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateModifier(int id, [FromBody] ModifierForUpdateDto modifierForUpdateDto)
        {
            var updatedModifier = await _modifierService.UpdateModifierAsync(id, modifierForUpdateDto);
            if (updatedModifier == null)
            {
                return NotFound();
            }
            return Ok(updatedModifier);
        }

        [HttpPost("{modifierId}/stockItems")]
        public async Task<IActionResult> LinkStockItem(int modifierId, [FromBody] ModifierStockItemLinkDto linkDto)
        {
            var success = await _modifierService.LinkStockItemAsync(modifierId, linkDto);
            if (!success)
            {
                return BadRequest("Failed to link stock item.");
            }
            return Ok();
        }

        [HttpDelete("{modifierId}/stockItems/{stockItemId}")]
        public async Task<IActionResult> UnlinkStockItem(int modifierId, int stockItemId)
        {
            var success = await _modifierService.UnlinkStockItemAsync(modifierId, stockItemId);
            if (!success)
            {
                return BadRequest("Failed to unlink stock item.");
            }
            return NoContent();
        }
    }
}
