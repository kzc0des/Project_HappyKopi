namespace happykopiAPI.DTOs.Product.Outgoing_Data
{
    public class ProductsWithCategoryDto
    {
        public int Id { get; set; }

        public string Name { get; set; }
        public string? ImageUrl { get; set; }

        public bool IsAvailable { get; set; }

        public int CategoryId { get; set; }
        public string CategoryName { get; set; } 

    }
}
