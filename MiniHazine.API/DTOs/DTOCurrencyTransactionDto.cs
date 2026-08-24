using MiniHazine.API.Entities;

namespace MiniHazine.API.DTOs
{
	public class DTOCurrencyTransactionDto
	{
		public int Id { get; set; }
		public string TransactionType { get; set; }
		public decimal Amount { get; set; }
		public decimal TotalRate { get; set; }
		public DateTime TransactionDate { get; set; }
		public int AccountId { get; set; }
		public string AccountName { get; set; }
		public string AccountType { get; set; }
		public string CustomerName { get; set; }
		public string CurrencyCode { get; set; }
		public Account Account { get; set; }
	}
}