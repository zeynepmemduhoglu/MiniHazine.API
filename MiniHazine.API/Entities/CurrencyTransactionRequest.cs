namespace MiniHazine.API.Entities
{
	public class CurrencyTransactionRequest
	{
		public int CustomerId { get; set; }
		public int AccountId { get; set; }        
		public int CurrencyId { get; set; }    
		public decimal Amount { get; set; }       
	}
}