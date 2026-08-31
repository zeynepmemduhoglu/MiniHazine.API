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
					CreatedAt = u.CreatedAt,
					Email = u.Email,
					PhoneNumber = u.PhoneNumber
				})
				.ToListAsync();

			return users;
		}

		public async Task<UserResponseDto> CreateUserAsync(UserCreateDto dto)
		{
			if (!string.IsNullOrEmpty(dto.Email) && await _context.Users.AnyAsync(u => u.Email == dto.Email))
			{
				throw new InvalidOperationException("Bu e-posta adresi zaten kullanımda.");
			}

			if (!string.IsNullOrEmpty(dto.PhoneNumber) && await _context.Users.AnyAsync(u => u.PhoneNumber == dto.PhoneNumber))
			{
				throw new InvalidOperationException("Bu telefon numarası zaten kullanımda.");
			}

			var user = new User
			{
				Username = dto.Username,
				Password = dto.Password,
				Role = dto.Role,
				Email = dto.Email,
				PhoneNumber = dto.PhoneNumber
			};

			_context.Users.Add(user);
			await _context.SaveChangesAsync();

			return new UserResponseDto
			{
				Id = user.Id,
				Username = user.Username,
				Role = user.Role,
				IsActive = user.IsActive,
				CreatedAt = user.CreatedAt,
				Email = user.Email,
				PhoneNumber = user.PhoneNumber
			};
		}

		public async Task<UserResponseDto> UpdateUserAsync(int id, UserUpdateDto dto)
		{
			var user = await _context.Users.FindAsync(id);
			if (user == null) throw new KeyNotFoundException("Kullanıcı bulunamadı.");

			
			if (user.Role == "Personel" && dto.Role == "Yönetici")
			{
				throw new InvalidOperationException("Personel rolündeki bir kullanıcı doğrudan yönetici yapılamaz.");
			}

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
				CreatedAt = user.CreatedAt,
				Email = user.Email,
				PhoneNumber = user.PhoneNumber
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

		public async Task<bool> UpdateProfileAsync(int id, UpdateProfileDto dto)
		{
			var user = await _context.Users.FindAsync(id);
			if (user == null) return false;

			if (!string.IsNullOrEmpty(dto.Email) && await _context.Users.AnyAsync(u => u.Email == dto.Email && u.Id != id))
			{
				throw new InvalidOperationException("Bu e-posta adresi başka bir kullanıcıya ait.");
			}

			if (!string.IsNullOrEmpty(dto.PhoneNumber) && await _context.Users.AnyAsync(u => u.PhoneNumber == dto.PhoneNumber && u.Id != id))
			{
				throw new InvalidOperationException("Bu telefon numarası başka bir kullanıcıya ait.");
			}

			user.Username = dto.Username;
			user.Email = dto.Email;
			user.PhoneNumber = dto.PhoneNumber;

			await _context.SaveChangesAsync();
			return true;
		}

		public async Task<bool> UpdatePreferencesAsync(int id, UpdatePreferencesDto dto)
		{
			var user = await _context.Users.FindAsync(id);
			if (user == null) return false;

			user.DefaultCurrency = dto.DefaultCurrency;
			user.NotificationsEnabled = dto.NotificationsEnabled;
			user.AutoRefresh = dto.AutoRefresh;

			await _context.SaveChangesAsync();
			return true;
		}
	}
}