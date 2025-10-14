using ChatBackend.Data;
using ChatBackend.Services;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<ChatContext>(options =>
    options.UseSqlite("Data Source=chat.db"));

builder.Services.AddControllers();
builder.Services.AddScoped<SentimentAnalysisService>();
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

// DB migration otomatik uygula
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<ChatContext>();
    db.Database.Migrate();
}

app.UseCors();
app.MapControllers();
app.Run();
