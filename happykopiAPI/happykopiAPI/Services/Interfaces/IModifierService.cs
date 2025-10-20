using happykopiAPI.DTOs.Modifier.Incoming_Data;
using happykopiAPI.DTOs.Modifier.Outgoing_Data;

namespace happykopiAPI.Services.Interfaces
{
    public interface IModifierService
    {
        Task<IEnumerable<ModifierCountDto>> GetModifierCountByTypeAsync();
        Task<IEnumerable<ModifierSummaryDto>> GetAllModifiersAsync();
        Task<IEnumerable<ModifierSummaryDto>> GetAvailableModifiersAsync();
        Task<ModifierDetailsDto> GetModifierByIdAsync(int modifierId);

        Task<ModifierSummaryDto> CreateModifierAsync(ModifierForCreateDto modifierForCreateDto);
        Task<bool> UpdateModifierAsync(int modifierId, ModifierForUpdateDto modifierForUpdateDto);

        Task<bool> LinkStockItemAsync(int modifierId, ModifierStockItemLinkDto linkDto);
        Task<bool> UnlinkStockItemAsync(int modifierId, int stockItemId);
    }
}
