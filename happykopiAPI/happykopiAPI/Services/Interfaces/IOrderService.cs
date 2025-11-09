using happykopiAPI.DTOs.Order.Outgoing_Data;

namespace happykopiAPI.Services.Interfaces
{
    public interface IOrderService
    {
        public Task<IEnumerable<CategoryWithProductCountDto>> GetCategoriesWithProductCountAsync();
    }
}
