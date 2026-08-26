using System;

namespace MiniHazine.API.DTOs
{
	public class DateRangeReportRequestDto
	{
		
		public DateTime StartDate { get; set; }		
		public DateTime EndDate { get; set; }

		public int? AccountId { get; set; } // isteğe bağlı , belirli bir hesabın hareketleri or null
	}
}