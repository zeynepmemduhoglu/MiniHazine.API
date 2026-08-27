namespace MiniHazine.API.DTOs
{
	public class DateRangeReportRequestDto
	{
		public DateTime StartDate { get; set; }
		public DateTime EndDate { get; set; }
		public string? CustomerName { get; set; } 
	}
}