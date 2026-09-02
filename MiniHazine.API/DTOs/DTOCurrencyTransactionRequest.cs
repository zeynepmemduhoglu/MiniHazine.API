namespace MiniHazine.API.DTOs
{
	public class DTOCurrencyTransactionRequest
	{
		public int CustomerId { get; set; }
		public int AccountId { get; set; }

		public int TargetAccountId { get; set; }
		public int CurrencyId { get; set; }
		public decimal Amount { get; set; }
		public string TransactionType { get; set; } 
	}
}