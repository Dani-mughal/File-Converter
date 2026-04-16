using System.ComponentModel.DataAnnotations;

namespace ConvertHub.Api.DTOs
{
    public class ConvertRequestDto
    {
        [Required]
        public IFormFile File { get; set; } = null!;

        [Required]
        public string ConversionType { get; set; } = string.Empty;
    }
}
