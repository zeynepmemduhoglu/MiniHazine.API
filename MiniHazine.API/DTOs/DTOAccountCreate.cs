namespace MiniHazine.API.DTOs
{
	public class DTOAccountCreate
	{
		public int? CustomerId { get; set; }
		public int CurrencyId { get; set; }
		public string AccountName { get; set; } = string.Empty;
		public decimal Balance { get; set; }

	}
}