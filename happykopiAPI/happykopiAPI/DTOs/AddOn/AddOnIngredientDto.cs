using happykopiAPI.DTOs.Inventory;

namespace happykopiAPI.DTOs.AddOn
{
    public class AddOnIngredientDto
    {
        public int IngredientId { get; set; }
        public IngredientDto Ingredient { get; set; }
        public int QuantityUsed { get; set; }
    }
}
