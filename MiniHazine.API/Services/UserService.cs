using Microsoft.EntityFrameworkCore;
using MiniHazine.API.DTOs;
using MiniHazine.API.Entities;

namespace MiniHazine.API.Services
{
	public class UserService
	{
		private readonly AppDbContext _context;

		public UserService(AppDbContext context)
		{
			_context = context;
		}

		public async Task<List<UserResponseDto>> GetAllUsersAsync()
		{
			if (_context.Users == null) return new List<UserResponseDto>();

			var users = await _context.Users
				.Where(u => u != null)
				.Select(u => new UserResponseDto // !
				{
					Id = u.Id,
					Username = u.Username,
					Role = u.Role
				})
				.ToListAsync();

			return users;
		}
	}
}