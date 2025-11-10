using System.ComponentModel.DataAnnotations;

namespace happykopiAPI.DTOs.Product.Incoming_Data
{
    public class ProductCreateFormDto
    {
        //[Required]
        public string? Name { get; set; }
        public string? Description { get; set; }

        //[Required]
        public int CategoryId { get; set; }

        public bool IsAvailable { get; set; } = true;
        public bool IsActive { get; set; } = true;

        public IFormFile? ImageFile { get; set; }

        public string? VariantsJson { get; set; }
    }
}
