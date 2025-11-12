using happykopiAPI.DTOs.Product.Incoming_Data;

namespace happykopiAPI.DTOs.Product.Outgoing_Data
{
    public class ProductDetailDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public int CategoryId { get; set; }
        public string CategoryName { get; set; }
        public bool IsAvailable { get; set; }
        public bool IsActive { get; set; }
        public string ImageUrl { get; set; }
        public string ImagePublicId { get; set; }
        public List<ProductVariantDetailDto> Variants { get; set; } = new List<ProductVariantDetailDto>();
    }

    public class ProductVariantDetailDto
    {
        public int Id { get; set; }

        public int OzAmount { get; set; }
        public int SizeId { get; set; }
        public string Size { get; set; }
        public decimal Price { get; set; }
        public List<ProductVariantIngredientDetailDto> Recipe { get; set; } = new List<ProductVariantIngredientDetailDto>();
        public List<ProductVariantAddOnDetailDto> AddOns { get; set; } = new List<ProductVariantAddOnDetailDto>();
    }

    public class ProductVariantIngredientDetailDto : ProductVariantIngredientCreateDto
    {
        public int ProductVariantId { get; set; }
        public string IngredientName { get; set; }
        public string UnitOfMeasure { get; set; }
    }

    public class ProductVariantAddOnDetailDto : ProductVariantAddOnCreateDto
    {
        public int ProductVariantId { get; set; }
        public string ModifierName { get; set; }
        public int Times { get; set; }
    }
}