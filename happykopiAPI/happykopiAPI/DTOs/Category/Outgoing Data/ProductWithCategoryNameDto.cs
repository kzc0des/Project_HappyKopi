namespace happykopiAPI.DTOs.Category.Outgoing_Data
{
    public class ProductWithCategoryNameDto
    {
        public int Id { get; set; }
        public string Name { get; set; } 
        public string CategoryName { get; set; }
        public string ImageUrl { get; set; }
        public bool IsActive { get; set; }
    }
}
