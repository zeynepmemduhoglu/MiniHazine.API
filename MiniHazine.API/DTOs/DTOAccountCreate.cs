namespace MiniHazine.API.DTOs
{
	public class DTOAccount
	{
		public long CustomerId { get; set; }      
		public decimal Balance { get; set; }      
		public int CurrencyId { get; set; }       
	}
}