using System;

namespace MiniHazine.API.DTOs
{
	public class DateRangeReportResponseDto
	{
		public int Id { get; set; }
		public DateTime TransactionDate { get; set; } 
		public decimal Amount { get; set; }           
		public decimal TotalRate { get; set; }       
		public string AccountNumber { get; set; }     
		public string CurrencyCode { get; set; }      
	}
}