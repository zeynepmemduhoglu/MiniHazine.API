namespace MiniHazine.API.Entities
{
	public class Customer
	{
		public int Id { get; set; }
		public string FirstName { get; set; } 
		public string LastName { get; set; } 
		public string IdentityNumber { get; set; } 
		public string Email { get; set; }
		public string PhoneNumber { get; set; } 
		public bool IsActive { get; set; } = true;

		public string AccountType { get; set; } = string.Empty;   
	}
}



