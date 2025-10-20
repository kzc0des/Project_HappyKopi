namespace happykopiAPI.DTOs.Modifier.Outgoing_Data
{
    public class ModifierDetailsDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public decimal Price { get; set; }
        public string Type { get; set; }
        public bool IsAvailable { get; set; }
        public List<ModifierStockItemDetailsDto> LinkedItems { get; set; }
    }
}
