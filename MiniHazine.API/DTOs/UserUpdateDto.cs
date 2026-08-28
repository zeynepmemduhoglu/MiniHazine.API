namespace MiniHazine.API.DTOs
{
	public class UserCreateDto
	{
		public string Username { get; set; }
		public string Password { get; set; }
		public string Role { get; set; }
	}

	public class UserResponseDto
	{
		public int Id { get; set; }
		public string Username { get; set; }
		public string Role { get; set; }
		public bool IsActive { get; set; }
		public DateTime CreatedAt { get; set; }
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
}