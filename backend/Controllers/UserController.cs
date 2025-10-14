using Microsoft.AspNetCore.Mvc;
using ChatBackend.Data;
using ChatBackend.Models;

namespace ChatBackend.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class UserController : ControllerBase
    {
        private readonly ChatContext _context;

        public UserController(ChatContext context)
        {
            _context = context;
        }

        [HttpPost]
        public IActionResult RegisterUser([FromBody] User user)
        {
            _context.Users.Add(user);
            _context.SaveChanges();
            return Ok(user);
        }

        [HttpGet]
        public IActionResult GetUsers()
        {
            var users = _context.Users.ToList();
            return Ok(users);
        }
    }
}
