using Microsoft.AspNetCore.Mvc;
using MiniHazine.API.Services;

namespace MiniHazine.API.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class ReportsController : ControllerBase
	{
		private readonly ReportService _reportService;

		public ReportsController(ReportService reportService)
		{
			_reportService = reportService;
		}

		[HttpGet("summary")]
		public async Task<IActionResult> GetSummary()
		{
			var summary = await _reportService.GetReportSummaryAsync();
			return Ok(summary);
		}

		
		[HttpGet("currency-distribution")]
		public async Task<IActionResult> GetCurrencyDistribution()
		{
			var distribution = await _reportService.GetCurrencyDistributionAsync();
			return Ok(distribution);
		}
	}
}