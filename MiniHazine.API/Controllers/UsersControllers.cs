using Microsoft.AspNetCore.Mvc;
using MiniHazine.API.DTOs;
using MiniHazine.API.Services;

namespace MiniHazine.API.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class UsersController : ControllerBase
	{
		private readonly UserService _userService;

		public UsersController(UserService userService)
		{
			_userService = userService;
		}

		[HttpGet]
		public async Task<ActionResult<List<UserResponseDto>>> GetAllUsers()
		{
			var users = await _userService.GetAllUsersAsync();
			return Ok(users);
		}
	}
}