namespace MiniHazine.API.DTOs
{
	public class DTOAccount
	{
		public long CustomerId { get; set; }      // hngi müşteriye hesap açılacağı
		public decimal Balance { get; set; }      
		public int CurrencyId { get; set; }      
	}
}