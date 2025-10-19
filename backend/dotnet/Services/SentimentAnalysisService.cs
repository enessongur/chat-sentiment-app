using System.Net.Http;
using System.Text;
using System.Text.Json;

namespace ChatBackend.Services
{
    public class SentimentAnalysisService
    {
        private readonly HttpClient _httpClient;
        private readonly string? _aiServiceUrl;

        public SentimentAnalysisService(HttpClient httpClient)
        {
            _httpClient = httpClient;

            // Render/Vercel gibi ortamlarda AI servis URL'sini env'den al
            _aiServiceUrl = Environment.GetEnvironmentVariable("AI_SERVICE_URL");
        }

        public string AnalyzeSentiment(string text)
        {
            if (string.IsNullOrWhiteSpace(text))
                return "neutral";

            // 1) Eğer AI servis URL'i tanımlıysa, HTTP ile harici servisi çağır
            if (!string.IsNullOrWhiteSpace(_aiServiceUrl))
            {
                try
                {
                    var requestBody = new { text };
                    var content = new StringContent(JsonSerializer.Serialize(requestBody), Encoding.UTF8, "application/json");
                    var endpoint = _aiServiceUrl!.TrimEnd('/') + "/api/predict";
                    var response = _httpClient.PostAsync(endpoint, content).GetAwaiter().GetResult();
                    response.EnsureSuccessStatusCode();

                    var responseString = response.Content.ReadAsStringAsync().GetAwaiter().GetResult();
                    using var json = JsonDocument.Parse(responseString);
                    if (json.RootElement.TryGetProperty("sentiment", out var sentimentProp))
                    {
                        var sentimentValue = sentimentProp.GetString();
                        if (!string.IsNullOrWhiteSpace(sentimentValue))
                        {
                            return sentimentValue!;
                        }
                    }
                }
                catch
                {
                    // Sessizce fallback'e geç (HD: harici servis geçici olarak ulaşılmaz olabilir)
                }
            }

            // 2) Fallback: basit kural tabanlı analiz (offline çalışır)
            var lowerText = text.ToLower();
            
            // Pozitif kelimeler
            var positiveWords = new[] { "good", "great", "excellent", "amazing", "wonderful", "fantastic", "awesome", "love", "like", "happy", "joy", "smile", "beautiful", "perfect", "best", "güzel", "harika", "mükemmel", "süper", "çok iyi", "seviyorum", "beğendim" };
            
            // Negatif kelimeler
            var negativeWords = new[] { "bad", "terrible", "awful", "hate", "dislike", "angry", "sad", "disappointed", "horrible", "worst", "kötü", "berbat", "nefret", "sinir", "üzgün", "hayal kırıklığı", "korkunç", "en kötü" };

            var positiveCount = positiveWords.Count(word => lowerText.Contains(word));
            var negativeCount = negativeWords.Count(word => lowerText.Contains(word));

            if (positiveCount > negativeCount)
                return "positive";
            else if (negativeCount > positiveCount)
                return "negative";
            else
                return "neutral";
        }

    }
}

