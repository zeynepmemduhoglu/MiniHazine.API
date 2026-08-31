using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MiniHazine.API.Entities;
namespace MiniHazine.API.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class AuthController : ControllerBase
	{
		private readonly AppDbContext _context;

		public AuthController(AppDbContext context)
		{
			_context = context;
		}

		[HttpPost("login")]
		public async Task<IActionResult> Login([FromBody] LoginDto model)
		{
			if (string.IsNullOrEmpty(model.Username) || string.IsNullOrEmpty(model.Password))
			{
				return BadRequest(new { message = "Kullanıcı adı ve şifre zorunludur." });
			}

			var user = await _context.Users
				.FirstOrDefaultAsync(u => u.Username == model.Username && u.Password == model.Password && u.IsActive);

			if (user == null)
			{
				return Unauthorized(new { message = "Kullanıcı adı veya şifre hatalı." });
			}

			return Ok(new
			{
				id = user.Id,
				username = user.Username,
				role = user.Role
			});
		}
	}

	public class LoginDto
	{
		public string Username { get; set; }
		public string Password { get; set; }
	}
}