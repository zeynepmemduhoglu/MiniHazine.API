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

		[HttpPost]
		public async Task<ActionResult<UserResponseDto>> Create([FromBody] UserCreateDto dto)
		{
			var createdUser = await _userService.CreateUserAsync(dto);
			return Ok(createdUser);
		}

		[HttpPut("{id}")]
		public async Task<ActionResult<UserResponseDto>> Update(int id, [FromBody] UserUpdateDto dto)
		{
			try
			{
				var updatedUser = await _userService.UpdateUserAsync(id, dto);
				return Ok(updatedUser);
			}
			catch (KeyNotFoundException ex)
			{
				return NotFound(ex.Message);
			}
		}

		[HttpDelete("{id}")]
		public async Task<IActionResult> Delete(int id)
		{
			var result = await _userService.DeleteUserAsync(id);
			if (!result) return NotFound("Kullanıcı bulunamadı.");
			return NoContent();
		}

		[HttpPost("{id}/change-password")]
		public async Task<IActionResult> ChangePassword(int id, [FromBody] ChangePasswordDto dto)
		{
			var result = await _userService.ChangePasswordAsync(id, dto);
			if (!result) return BadRequest(new { message = "Mevcut şifre hatalı veya kullanıcı bulunamadı." });
			return Ok(new { message = "Şifre başarıyla değiştirildi." });
		}
	}
}