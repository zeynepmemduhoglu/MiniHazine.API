namespace MiniHazine.API.Entities
{
	public class Account
	{
		public int Id { get; set; }
		public int CustomerId { get; set; }   // bu hesap hangi müşterinin
		public int CurrencyId { get; set; } // bu hesabın açıldığı para birimi 
		public string AccountNumber { get; set; } = string.Empty;
		public decimal Balance { get; set; }
		public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
	}
}