using Microsoft.AspNetCore.Mvc;
using MiniHazine.API.DTOs;
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
			var result = await _reportService.GetReportSummaryAsync();
			return Ok(result);
		}


		[HttpGet("currency-distribution")]
		public async Task<IActionResult> GetCurrencyDistribution()
		{
			var result = await _reportService.GetCurrencyDistributionAsync();
			return Ok(result);
		}


		[HttpGet("customer-transactions")]
		public async Task<IActionResult> GetCustomerTransactions()
		{
			var result = await _reportService.GetCustomerTransactionReportAsync();
			return Ok(result);
		}


		[HttpGet("date-range")]
		public async Task<IActionResult> GetTransactionsByDateRange([FromQuery] DateRangeReportRequestDto request)
		{
			var result = await _reportService.GetTransactionsByDateRangeAsync(request);
			return Ok(result);
		}
	}
}