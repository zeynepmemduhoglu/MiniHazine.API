namespace MiniHazine.API.DTOs
{
	public class CurrencyBalanceDto
	{
		public string CurrencyCode { get; set; } = string.Empty;
		public decimal TotalBalance { get; set; }
		public int AccountCount { get; set; }
	}
}