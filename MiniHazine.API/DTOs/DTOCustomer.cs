namespace MiniHazine.API.DTOs
{
	public class DTOCustomer
	{
		public long CustomerId { get; set; }
		public string FirstName { get; set; } = string.Empty;
		public string LastName { get; set; } = string.Empty;
		public string Email { get; set; } = string.Empty;
		public string IdentityNumber { get; set; } = string.Empty;
		public string AccountCurrencyCode { get; set; } = string.Empty;
		public string PhoneNumber { get; set; } = string.Empty;

	
	}
}