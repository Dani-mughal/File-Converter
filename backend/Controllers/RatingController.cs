using Microsoft.AspNetCore.Mvc;

namespace ConvertHub.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RatingController : ControllerBase
    {
        private readonly ILogger<RatingController> _logger;

        // In a real app, inject DbContext here to store ratings.
        // For now we log and return success.
        public RatingController(ILogger<RatingController> logger)
        {
            _logger = logger;
        }

        public class RatingDto
        {
            public int Score { get; set; }
            public string? Feedback { get; set; }
            public string? ConversionType { get; set; }
        }

        [HttpGet("stats")]
        public IActionResult GetStats()
        {
            // Mock dynamic stats for UI display
            return Ok(new { 
                averageRating = 4.9, 
                totalReviews = 1250,
                satisfactionRate = "98%"
            });
        }

        [HttpPost]
        public IActionResult SubmitRating([FromBody] RatingDto rating)
        {
            if (rating.Score < 1 || rating.Score > 5)
            {
                return BadRequest(new { success = false, message = "Invalid rating score." });
            }

            _logger.LogInformation("[RATING SUBMITTED] Score: {Score}/5 | Type: {ConversionType} | Feedback: {Feedback}", 
                rating.Score, rating.ConversionType, rating.Feedback ?? "None");

            return Ok(new { success = true, message = "Rating submitted successfully." });
        }
    }
}
