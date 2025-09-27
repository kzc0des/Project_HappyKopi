namespace happykopiAPI.DTOs.AddOn
{
    public class AddOnDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public decimal Price { get; set; }
        public bool IsAvailable { get; set; }
        public ICollection<AddOnIngredientDto> AddOnIngredients { get; set; }
    }
}
