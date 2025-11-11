namespace happykopiAPI.DTOs.Order.Outgoing_Data
{
    public class OrderVariantDto
    {
        // Maps to ProductVariants.Id
        public int Id { get; set; }

        // Maps to ProductVariants.ProductId
        public int ProductId { get; set; }

        // Maps to ProductVariants.Size (e.g., 'Small', 'Large', etc.)
        public string Size { get; set; }

        // Maps to ProductVariants.Price (The base price of the variant)
        public decimal Price { get; set; } 
    }
}