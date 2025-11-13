namespace happykopiAPI.DTOs.Product.Outgoing_Data
{
    public class ProductAvailabilityResponseDto
    {
        public List<ProductWithAvailabilityDto> AvailableProducts { get; set; } = new();
        public List<UnavailableProductDto> UnavailableProducts { get; set; } = new();
    }

    public class ProductWithAvailabilityDto
    {
        public int ProductId { get; set; }
        public string ProductName { get; set; } = string.Empty;
        public string CategoryName { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public string? ImageUrl { get; set; }
        public bool IsAvailable { get; set; }
    }

    public class UnavailableProductDto
    {
        public int ProductId { get; set; }
        public string ProductName { get; set; } = string.Empty;
        public string CategoryName { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public string? ImageUrl { get; set; }
        public string Reason { get; set; } = string.Empty;
        public List<IngredientIssueDto> Details { get; set; } = new();
    }

    public class IngredientIssueDto
    {
        public string IngredientName { get; set; } = string.Empty;
        public decimal Required { get; set; }
        public decimal Available { get; set; }
        public string UnitOfMeasure { get; set; } = string.Empty;
        public int? ExpiredBatchCount { get; set; }
        public int? TotalBatchCount { get; set; }
    }
}