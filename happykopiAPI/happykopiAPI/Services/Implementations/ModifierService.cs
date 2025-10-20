using happykopiAPI.DTOs.Modifier.Incoming_Data;
using happykopiAPI.DTOs.Modifier.Outgoing_Data;
using happykopiAPI.Services.Interfaces;

namespace happykopiAPI.Services.Implementations
{
    public class ModifierService : IModifierService
    {
        public ModifierService()
        {

        }

        public Task<ModifierDto> CreateModifierAsync(ModifierForCreateDto modifierForCreateDto)
        {
            throw new NotImplementedException();
        }

        public Task<IEnumerable<ModifierDto>> GetAllModifiersAsync()
        {
            throw new NotImplementedException();
        }

        public Task<IEnumerable<ModifierDto>> GetAvailableModifiersAsync()
        {
            throw new NotImplementedException();
        }

        public Task<bool> LinkStockItemAsync(int modifierId, ModifierStockItemLinkDto linkDto)
        {
            throw new NotImplementedException();
        }

        public Task<bool> UnlinkStockItemAsync(int modifierId, int stockItemId)
        {
            throw new NotImplementedException();
        }

        public Task<bool> UpdateModifierAsync(int modifierId, ModifierForUpdateDto modifierForUpdateDto)
        {
            throw new NotImplementedException();
        }
    }
}
