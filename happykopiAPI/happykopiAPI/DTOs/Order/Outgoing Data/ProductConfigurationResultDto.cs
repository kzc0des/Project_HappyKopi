namespace happykopiAPI.DTOs.Order.Outgoing_Data
{
    public class ProductConfigurationResultDto
    {
        // 1. Result Set 1: Variants
        public List<OrderVariantDto> Variants { get; set; } = new List<OrderVariantDto>();

        // 2. Result Set 2: Ingredients
        public List<OrderVariantIngredientDto> Ingredients { get; set; } = new List<OrderVariantIngredientDto>();

        // 3. Result Set 3: AddOns (Modifiers)
        public List<OrderVarianAddontDto> AddOns { get; set; } = new List<OrderVarianAddontDto>();
    }
}