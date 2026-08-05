namespace MiniHazine.API.Entities
{
	public class CurrencyTransaction
	{
		public int Id { get; set; }
		public int CustomerId { get; set; }
		public int AccountId { get; set; }   
		public int CurrencyId { get; set; }
		public decimal Amount { get; set; }
		public decimal TotalRate { get; set; }    
		public string TransactionType { get; set; } 
		public DateTime TransactionDate { get; set; }
	}
}