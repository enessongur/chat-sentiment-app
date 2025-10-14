using Microsoft.ML;
using Microsoft.ML.Data;

namespace ChatBackend.Services
{
    public class SentimentAnalysisService
    {
        private readonly MLContext _mlContext;
        private readonly ITransformer _model;

        public SentimentAnalysisService()
        {
            _mlContext = new MLContext();
            _model = CreateSimpleModel();
        }

        public string AnalyzeSentiment(string text)
        {
            if (string.IsNullOrWhiteSpace(text))
                return "neutral";

            // Basit kural tabanlı sentiment analizi
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

        private ITransformer CreateSimpleModel()
        {
            // Basit bir model oluştur - gerçek uygulamada daha gelişmiş model kullanılabilir
            var data = new List<SentimentData>
            {
                new SentimentData { Text = "I love this!", Sentiment = "positive" },
                new SentimentData { Text = "This is terrible!", Sentiment = "negative" },
                new SentimentData { Text = "It's okay.", Sentiment = "neutral" }
            };

            var dataView = _mlContext.Data.LoadFromEnumerable(data);
            var pipeline = _mlContext.Transforms.Text.FeaturizeText("Features", "Text")
                .Append(_mlContext.Transforms.Conversion.MapValueToKey("Label", "Sentiment"))
                .Append(_mlContext.MulticlassClassification.Trainers.SdcaMaximumEntropy())
                .Append(_mlContext.Transforms.Conversion.MapKeyToValue("PredictedLabel"));

            return pipeline.Fit(dataView);
        }
    }

    public class SentimentData
    {
        public string Text { get; set; } = string.Empty;
        public string Sentiment { get; set; } = string.Empty;
    }
}

