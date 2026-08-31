namespace MiniHazine.API.DTOs
{
	public class UserCreateDto
	{
		public string Username { get; set; }
		public string Password { get; set; }
		public string Role { get; set; }
		public string Email { get; set; }        
		public string PhoneNumber { get; set; }
	}

	public class UserResponseDto
	{
		public int Id { get; set; }
		public string Username { get; set; }
		public string Role { get; set; }
		public bool IsActive { get; set; }
		public DateTime CreatedAt { get; set; }
		public string Email { get; set; }        
		public string PhoneNumber { get; set; }
	}

	public class UserUpdateDto
	{
		public string Username { get; set; }
		public string Role { get; set; }
		public bool IsActive { get; set; }
	}

	public class ChangePasswordDto
	{
		public string CurrentPassword { get; set; }
		public string NewPassword { get; set; }
	}

	public class UpdateProfileDto
	{
		public string Username { get; set; }
		public string Email { get; set; }
		public string PhoneNumber { get; set; }
	}

	public class UpdatePreferencesDto
	{
		public string DefaultCurrency { get; set; }
		public bool NotificationsEnabled { get; set; }
		public bool AutoRefresh { get; set; }
	}
}