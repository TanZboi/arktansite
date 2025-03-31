using System.Net.Http.Json;
using System.Text.Json;
using Microsoft.Extensions.Logging;

public class FurAffinityService
{
    private readonly HttpClient _httpClient;
    private readonly ILogger<FurAffinityService> _logger;

    public FurAffinityService(HttpClient httpClient, ILogger<FurAffinityService> logger)
    {
        _httpClient = httpClient;
        _logger = logger;
    }

    public async Task<List<ArtPiece>> GetGalleryAsync(string username)
    {
        var encodedUrl = Uri.EscapeDataString($"https://api.furaffinity.net/user/{username}/gallery");
        var url = $"http://localhost:3000/proxy?url={encodedUrl}";
        _logger.LogInformation($"Fetching data from URL: {url}");

        try
        {
            var response = await _httpClient.GetFromJsonAsync<AllOriginsResponse>(url);
            if (response == null)
            {
                _logger.LogError("Failed to fetch data from the API.");
                return new List<ArtPiece>();
            }
            var content = JsonSerializer.Deserialize<FurAffinityResponse>(response.Contents);
            if (content == null)
            {
                _logger.LogError("Failed to deserialize the API response.");
                return new List<ArtPiece>();
            }
            return content.ArtPieces ?? new List<ArtPiece>();
        }
        catch (HttpRequestException ex)
        {
            _logger.LogError($"Request error: {ex.Message}");
            return new List<ArtPiece>();
        }
        catch (JsonException ex)
        {
            _logger.LogError($"Serialization error: {ex.Message}");
            return new List<ArtPiece>();
        }
    }
}

public class AllOriginsResponse
{
    public string Contents { get; set; }
}

public class ArtPiece
{
    public string Title { get; set; }
    public string ImageUrl { get; set; }
    public string Description { get; set; }
}

public class FurAffinityResponse
{
    public List<ArtPiece> ArtPieces { get; set; }
}