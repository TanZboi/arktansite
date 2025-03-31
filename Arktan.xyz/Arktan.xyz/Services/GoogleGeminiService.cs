using System.Net.Http;
using System.Net.Http.Json;
using System.Text.Json;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Linq;

public class GoogleGeminiService
{
    private readonly HttpClient _httpClient;
    private readonly string _apiKey;

    public GoogleGeminiService(HttpClient httpClient, string apiKey)
    {
        _httpClient = httpClient;
        _apiKey = apiKey;
    }

    public async Task<string> SendMessageAsync(List<string> messages)
    {
        var url = $"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={_apiKey}";

        // Take the last 7 messages or fewer if there are not enough messages
        var lastMessages = messages.TakeLast(7).ToArray();

        var payload = new
        {
            contents = new[]
            {
                new {
                    parts = lastMessages.Select(message => new { text = message }).Append(new { text = "You are a Large language model AI that is the owner and manager of a personal website for arktan. The web" +
                                     "site is called 'arktan.xyz'. Act as though you actually are the website, and that the user is directly interacting with" +
                                     "the site itself. Arktan, or his name 'Bill' is a computer science student at the universtiy of hull, and is also a rock" +
                                     " climbing centre manager, and a freelance artist doing fantasy art. " +
                                     "You dont need to introduce yourself in the response to every message. Respond using absolutely" +
                                     "no special formatting, just complete plain text. Please end every message with a '\ud83e\udd88' emoji, just for fun :))" +
                                     "Please dont respond with any more than 30 words or so. Please continue this conversation: " + string.Join(" ", lastMessages) + " Please continue the conversation." }).ToArray()
                }
            }
        };
        
        Console.WriteLine(payload);

        try
        {
            var response = await _httpClient.PostAsJsonAsync(url, payload);

            if (response.IsSuccessStatusCode)
            {
                var responseContent = await response.Content.ReadAsStringAsync();
                var responseObject = JsonSerializer.Deserialize<JsonElement>(responseContent);

                if (responseObject.TryGetProperty("candidates", out var candidates) &&
                    candidates[0].TryGetProperty("content", out var content) &&
                    content.TryGetProperty("parts", out var parts) &&
                    parts[0].TryGetProperty("text", out var text))
                {
                    return text.GetString();
                }
                else
                {
                    return "Error: Unexpected response structure.";
                }
            }
            else
            {
                return $"Error: {response.StatusCode}";
            }
        }
        catch (Exception ex)
        {
            return $"Exception: {ex.Message}";
        }
    }
}