using happykopiAPI.DTOs.Modifier.Incoming_Data;
using happykopiAPI.DTOs.Modifier.Outgoing_Data;
using happykopiAPI.Enums;

namespace happykopiAPI.Services.Interfaces
{
    public interface IModifierService
    {
        Task<IEnumerable<ModifierCountDto>> GetModifierCountByTypeAsync();
        Task<IEnumerable<ModifierSummaryDto>> GetAllModifiersAsync();
        Task<IEnumerable<ModifierSummaryDto>> GetAvailableModifiersAsync();
        Task<IEnumerable<ModifierSummaryDto>> GetInactiveModifiersAsync();
        Task<IEnumerable<ModifierSummaryDto>> GetModifiersByTypeAsync(ModifierType modifierType);
        Task<ModifierDetailsDto> GetModifierByIdAsync(int modifierId);
        Task<ModifierSummaryDto> CreateModifierAsync(ModifierForCreateDto modifierForCreateDto);
        Task<bool> UpdateModifierAsync(int modifierId, ModifierForUpdateDto modifierForUpdateDto);
        Task<bool> DeleteModifierAsync(int modifierId);
        Task<bool> LinkStockItemAsync(int modifierId, ModifierStockItemLinkDto linkDto);
        Task<bool> UnlinkStockItemAsync(int modifierId, int stockItemId);
    }
}
