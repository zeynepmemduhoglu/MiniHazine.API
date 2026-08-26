namespace MiniHazine.API.DTOs
{
	public class CustomerTransactionReportDto
	{
		public int CustomerId { get; set; }
		public string CustomerName { get; set; } 
		public int TotalAccountCount { get; set; } 
		public int TotalTransactionCount { get; set; } 
		public decimal TotalBuyAmount { get; set; } 
		public decimal TotalSellAmount { get; set; } 
	}
}