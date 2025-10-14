using System;

namespace ChatBackend.Models
{
    public class Message
    {
        public int Id { get; set; }
        public string UserId { get; set; } = string.Empty; // null uyarısını önler
        public string Text { get; set; } = string.Empty;
        public string Sentiment { get; set; } = string.Empty;
        public DateTime Timestamp { get; set; } = DateTime.UtcNow;
    }
}
