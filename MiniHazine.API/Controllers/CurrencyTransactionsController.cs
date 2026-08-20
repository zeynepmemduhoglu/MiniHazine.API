using Microsoft.AspNetCore.Mvc;
using MiniHazine.API.DTOs;
using MiniHazine.API.Services;

namespace MiniHazine.API.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class CurrencyTransactionsController : ControllerBase
	{
		private readonly CurrencyTransactionService _transactionService;

		public CurrencyTransactionsController(CurrencyTransactionService transactionService)
		{
			_transactionService = transactionService;
		}

		
		[HttpPost("buy")]
		public async Task<IActionResult> BuyCurrency([FromBody] DTOCurrencyTransactionRequest request)
		{
			var result = await _transactionService.BuyCurrencyAsync(request);

			if (!result.Success)
			{
				return BadRequest(new { message = result.Message });
			}

			return Ok(new { message = result.Message, transaction = result.Transaction });
		}

		
		[HttpPost("sell")]
		public async Task<IActionResult> SellCurrency([FromBody] DTOCurrencyTransactionRequest request)
		{
			var result = await _transactionService.SellCurrencyAsync(request);

			if (!result.Success)
			{
				return BadRequest(new { message = result.Message });
			}

			return Ok(new { message = result.Message, transaction = result.Transaction });
		}
	}
}