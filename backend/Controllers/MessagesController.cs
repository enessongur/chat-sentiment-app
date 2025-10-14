using Microsoft.AspNetCore.Mvc;
using ChatBackend.Data;
using ChatBackend.Models;
using ChatBackend.Services;
using Microsoft.EntityFrameworkCore;

namespace ChatBackend.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class MessagesController : ControllerBase
    {
        private readonly ChatContext _context;
        private readonly SentimentAnalysisService _sentimentService;

        public MessagesController(ChatContext context, SentimentAnalysisService sentimentService)
        {
            _context = context;
            _sentimentService = sentimentService;
        }

        [HttpGet]
        public async Task<IActionResult> GetMessages()
        {
            var messages = await _context.Messages.OrderBy(m => m.Timestamp).ToListAsync();
            return Ok(messages);
        }

        [HttpPost]
        public async Task<IActionResult> PostMessage([FromBody] Message message)
        {
            // Sentiment analizi yap
            message.Sentiment = _sentimentService.AnalyzeSentiment(message.Text);
            message.Timestamp = DateTime.UtcNow;
            
            _context.Messages.Add(message);
            await _context.SaveChangesAsync();
            return Ok(message);
        }
    }
}
