using System.Text.Json;
using System.Text;

namespace ConvertHub.Api.Services.Implementation
{
    public class IndexNowService
    {
        private readonly ILogger<IndexNowService> _logger;
        private readonly HttpClient _httpClient;
        private const string Host = "converterhub.tech";
        private const string IndexNowKey = "90c6861616c4493e813f0a5f973715df";
        private const string KeyLocation = "https://converterhub.tech/90c6861616c4493e813f0a5f973715df.txt";

        public IndexNowService(ILogger<IndexNowService> logger)
        {
            _logger = logger;
            _httpClient = new HttpClient();
        }

        public async Task<bool> SubmitUrlsAsync(List<string> urls)
        {
            try
            {
                var payload = new
                {
                    host = Host,
                    key = IndexNowKey,
                    keyLocation = KeyLocation,
                    urlList = urls
                };

                var content = new StringContent(JsonSerializer.Serialize(payload), Encoding.UTF8, "application/json");
                
                // Ping Bing
                var response = await _httpClient.PostAsync("https://www.bing.com/indexnow", content);
                
                if (response.IsSuccessStatusCode)
                {
                    _logger.LogInformation("Successfully submitted {Count} URLs to IndexNow.", urls.Count);
                    return true;
                }
                
                _logger.LogWarning("IndexNow submission failed with status code: {StatusCode}", response.StatusCode);
                return false;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error submitting URLs to IndexNow.");
                return false;
            }
        }
    }
}
