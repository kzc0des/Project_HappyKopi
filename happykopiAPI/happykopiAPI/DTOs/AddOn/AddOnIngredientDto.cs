using happykopiAPI.DTOs.Inventory;

namespace happykopiAPI.DTOs.AddOn
{
    public class AddOnIngredientDto
    {
        public int IngredientId { get; set; }
        public StockItemDto Ingredient { get; set; }
        public int QuantityUsed { get; set; }
    }
}
