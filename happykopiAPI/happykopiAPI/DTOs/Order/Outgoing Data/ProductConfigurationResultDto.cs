namespace happykopiAPI.DTOs.Order.Outgoing_Data
{
    public class ProductConfigurationResultDto
    {
        public List<OrderVariantDto> Variants { get; set; } = new();
        public List<OrderVariantIngredientDto> Ingredients { get; set; } = new();
        public List<OrderVarianAddontDto> AddOns { get; set; } = new();
        public List<OrderModifierSummaryDto> AllAvailableAddons { get; set; } = new();

    }
}