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
		private readonly ILogger<CurrencyTransactionsController> _logger;

		public CurrencyTransactionsController(CurrencyTransactionService transactionService, ILogger<CurrencyTransactionsController> logger)
		{
			_transactionService = transactionService;
			_logger = logger;
		}

		
		[HttpGet]
		public async Task<IActionResult> GetAllTransactions()
		{
			try
			{
				var transactions = await _transactionService.GetTransactionsAsync();
				return Ok(transactions);
			}
			catch (Exception ex)
			{
				_logger.LogError(ex, "İşlem geçmişi getirilirken hata oluştu.");
				return StatusCode(500, new { message = "İşlem geçmişi yüklenirken bir hata oluştu." });
			}
		}

		[HttpPost("buy")]
		public async Task<IActionResult> BuyCurrency([FromBody] DTOCurrencyTransactionRequest request)
		{
			_logger.LogInformation("Buy isteği alındı -> CustomerId: {CustomerId}, AccountId: {AccountId}, CurrencyId: {CurrencyId}, Amount: {Amount}",
				request?.CustomerId, request?.AccountId, request?.CurrencyId, request?.Amount);

			var result = await _transactionService.BuyCurrencyAsync(request);

			if (!result.Success)
			{
				_logger.LogWarning("Buy işlemi başarısız: {Message}", result.Message);
				return BadRequest(new { message = result.Message });
			}

			return Ok(new { message = result.Message, transaction = result.Transaction });
		}

		[HttpPost("sell")]
		public async Task<IActionResult> SellCurrency([FromBody] DTOCurrencyTransactionRequest request)  // dto döndür
		{
			_logger.LogInformation("Sell isteği alındı -> CustomerId: {CustomerId}, AccountId: {AccountId}, CurrencyId: {CurrencyId}, Amount: {Amount}",
				request?.CustomerId, request?.AccountId, request?.CurrencyId, request?.Amount);

			var result = await _transactionService.SellCurrencyAsync(request);

			if (!result.Success)
			{
				_logger.LogWarning("Sell işlemi başarısız: {Message}", result.Message);
				return BadRequest(new { message = result.Message });
			}

			return Ok(new { message = result.Message, transaction = result.Transaction });
		}
	}
}