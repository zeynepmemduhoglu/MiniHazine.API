namespace MiniHazine.API.Entities
{
	public class ExchangeRate
	{
		public int Id { get; set; }
		public int CurrencyId { get; set; }       
		public string Pair { get; set; }        
		public decimal BuyRate { get; set; }
		public decimal SellRate { get; set; }
		public DateTime UpdatedDate { get; set; }
	}
}