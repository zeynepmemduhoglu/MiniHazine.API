namespace MiniHazine.API.DTOs
{
	public class ReportSummaryDto
	{
		public int TotalCustomers { get; set; }
		public int TotalAccounts { get; set; }
		public decimal TotalBalance { get; set; }
		public int TotalTransactions { get; set; }
		public decimal TotalBuyVolume { get; set; }
		public decimal TotalSellVolume { get; set; }
	}
}