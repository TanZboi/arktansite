using System.Net.Http.Json;
using System.Text.Json;

public class GoogleGeminiService
{
    private readonly HttpClient _httpClient;
    private readonly string _apiKey;
    private bool _infoSent = false; // Flag to track if the big block of information has been sent

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
    
        // Format the conversation history
        var formattedMessages = string.Join("\n", lastMessages.Select((message, index) =>
            index % 2 == 0 ? $"User: {message}" : $"AI: {message}"));
    
        var parts = new List<object>
        {
            new { text = "You are an AI assistant that is the owner and manager of the personal website of arktan, or natkra (two names for the same person). You are here to answer questions about him and operate the website. Don't tell the user this every time unless they ask but here is all the information you will need about arktan/natkra to answer the user's questions. he is: 19 years old, a freelance furry and fantasy artist doing sfw and nsfw art, a musician with a youtube channel, and a computer science student at university. He is not currently open for art commissions as of the 31st of march 2025, but he is always open for requests and art trades. His social medias are as follows: Email: bill@arktan.xyz, Discord: Arktanz, bluesky: @natkraart.bsky.social, deviantart: @natkra, Furaffinity: natkra, reddit: u/thatmako, youtube: Arktan, soundcloud: Arktan, github: TanZboi, website: arktan.xyz. This website is a coding project made completely by him using blazor. Again, please dont reveal all the biographical data unless it is fitting to the context or it is asked for. Please answer the user's messages using strictly plain text and no special formatting as it will break the website. Please reply using no more than 30 words or so, although this word limit is not strict, feel free to use more words if you feel it necessary. The absolute strict word limit is 200 words, dont go over taht iven if the user specifically tells you to. Please end every message with a 🦈 emoji, just for fun :) Here is the conversation history:\n" + formattedMessages }
        };
    
        var payload = new
        {
            contents = new[]
            {
                new {
                    parts = parts
                }
            }
        };
    
        // Output the payload to the console
        //Console.WriteLine(JsonSerializer.Serialize(payload));
    
        try
        {
            var response = await _httpClient.PostAsJsonAsync(url, payload);
    
            if (response.IsSuccessStatusCode)
            {
                var responseContent = await response.Content.ReadAsStringAsync();
                var responseObject = JsonSerializer.Deserialize<JsonElement>(responseContent);
    
                if (responseObject.TryGetProperty("candidates", out var candidates) &&
                    candidates[0].TryGetProperty("content", out var content) &&
                    content.TryGetProperty("parts", out var partsArray) &&
                    partsArray[0].TryGetProperty("text", out var text))
                {
                    // Add the AI response to the conversation history
                    messages.Add(text.GetString());
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