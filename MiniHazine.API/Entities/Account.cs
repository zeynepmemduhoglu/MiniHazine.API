namespace MiniHazine.API.Entities
{
	public class Account
	{
		public int Id { get; set; }
		public int CustomerId { get; set; }
		public int CurrencyId { get; set; }

		
		public Customer Customer { get; set; }
		public Currency Currency { get; set; }

		public string AccountName { get; set; } = string.Empty;
		public string AccountNumber { get; set; } = string.Empty;
		public decimal Balance { get; set; }
		public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
	}
}