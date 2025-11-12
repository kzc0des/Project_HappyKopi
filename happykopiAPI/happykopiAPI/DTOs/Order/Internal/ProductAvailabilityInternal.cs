namespace happykopiAPI.DTOs.Product.Internal
{
    public class ProductAvailabilityFromDbDto
    {
        public int ProductId { get; set; }
        public string ProductName { get; set; } = string.Empty;
        public string CategoryName { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public string? ImageUrl { get; set; }
        public bool IsAvailable { get; set; }
    }

    public class IngredientIssueFromDbDto
    {
        public int ProductId { get; set; }
        public string Reason { get; set; } = string.Empty;
        public string IngredientName { get; set; } = string.Empty;
        public decimal Required { get; set; }
        public decimal Available { get; set; }
        public string UnitOfMeasure { get; set; } = string.Empty;
        public int? ExpiredBatchCount { get; set; }
        public int? TotalBatchCount { get; set; }
    }
}