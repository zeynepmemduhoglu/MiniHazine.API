using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MiniHazine.API.DTOs;
using MiniHazine.API.Entities;
using MiniHazine.API.Services;

namespace MiniHazine.API.Controllers
{
	[Route("api/currency-transactions")]
	[ApiController]
	public class CurrencyTransactionsController : ControllerBase
	{
		private readonly DTOCurrencyTransactionService _transactionService;
		private readonly AppDbContext _context; 

		public CurrencyTransactionsController(DTOCurrencyTransactionService transactionService, AppDbContext context)
		{
			_transactionService = transactionService;
			_context = context;
		}

		
		[HttpPost("buy")]
		public async Task<IActionResult> BuyCurrency([FromBody] DTOCurrencyTransactionRequest request)
		{
			var result = await _transactionService.BuyCurrencyAsync(request);

			if (!result.Success)
			{
				return BadRequest(result.Message);
			}

			return Ok(new { Message = result.Message, Transaction = result.Transaction });
		}

		
		[HttpPost("sell")]
		public async Task<IActionResult> SellCurrency([FromBody] DTOCurrencyTransactionRequest request)
		{
			var result = await _transactionService.SellCurrencyAsync(request);

			if (!result.Success)
			{
				return BadRequest(result.Message);
			}

			return Ok(new { Message = result.Message, Transaction = result.Transaction });
		}

		
		[HttpGet]
		public async Task<IActionResult> GetTransactions()
		{
			var transactions = await _context.CurrencyTransactions.ToListAsync();
			return Ok(transactions);
		}
	}
}