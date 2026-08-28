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
				.Select(u => new UserResponseDto
				{
					Id = u.Id,
					Username = u.Username,
					Role = u.Role,
					IsActive = u.IsActive,
					CreatedAt = u.CreatedAt
				})
				.ToListAsync();

			return users;
		}

		public async Task<UserResponseDto> CreateUserAsync(UserCreateDto dto)
		{
			var user = new User
			{
				Username = dto.Username,
				Password = dto.Password,
				Role = dto.Role
			};

			_context.Users.Add(user);
			await _context.SaveChangesAsync();

			return new UserResponseDto
			{
				Id = user.Id,
				Username = user.Username,
				Role = user.Role,
				IsActive = user.IsActive,
				CreatedAt = user.CreatedAt
			};
		}

		public async Task<UserResponseDto> UpdateUserAsync(int id, UserUpdateDto dto)
		{
			var user = await _context.Users.FindAsync(id);
			if (user == null) throw new KeyNotFoundException("Kullanıcı bulunamadı.");

			user.Username = dto.Username;
			user.Role = dto.Role;
			user.IsActive = dto.IsActive;

			await _context.SaveChangesAsync();

			return new UserResponseDto
			{
				Id = user.Id,
				Username = user.Username,
				Role = user.Role,
				IsActive = user.IsActive,
				CreatedAt = user.CreatedAt
			};
		}

		public async Task<bool> DeleteUserAsync(int id)
		{
			var user = await _context.Users.FindAsync(id);
			if (user == null) return false;

			_context.Users.Remove(user);
			await _context.SaveChangesAsync();
			return true;
		}

		public async Task<bool> ChangePasswordAsync(int id, ChangePasswordDto dto)
		{
			var user = await _context.Users.FindAsync(id);
			if (user == null || user.Password != dto.CurrentPassword) return false;

			user.Password = dto.NewPassword;
			await _context.SaveChangesAsync();
			return true;
		}
	}
}