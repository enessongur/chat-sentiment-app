using Microsoft.EntityFrameworkCore;
using ChatBackend.Models;

namespace ChatBackend.Data
{
    public class ChatContext : DbContext
    {
        public ChatContext(DbContextOptions<ChatContext> options) : base(options) { }

        public DbSet<Message> Messages { get; set; }
        public DbSet<User> Users { get; set; } // UserController için eklendi
    }
}
