using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MiniHazine.API.Entities;

namespace MiniHazine.API.Controllers
{
	[Route("api/currency-transactions")]
	[ApiController]
	public class CurrencyTransactionsController : ControllerBase
	{
		private readonly AppDbContext _context;

		public CurrencyTransactionsController(AppDbContext context)
		{
			_context = context;
		}

		// 1. DÖVİZ ALIŞ İŞLEMİ (Buy)
		[HttpPost("buy")]
		public async Task<IActionResult> BuyCurrency([FromBody] CurrencyTransactionRequest request)
		{
			// Hesap kontrolü
			var account = await _context.Accounts.FirstOrDefaultAsync(a => a.Id == request.AccountId && a.CustomerId == request.CustomerId);
			if (account == null)
			{
				return BadRequest("Hata: Belirtilen müşteri veya hesap bulunamadı!");
			}

			// Kur bilgisini al (Örn: USD kuru)
			var exchangeRate = await _context.ExchangeRates.FirstOrDefaultAsync(e => e.CurrencyId == request.CurrencyId);
			if (exchangeRate == null)
			{
				return BadRequest("Hata: Bu para birimi için geçerli kur bulunamadı!");
			}

			// Maliyet hesaplama (Alış kuru üzerinden)
			decimal totalCost = request.Amount * exchangeRate.BuyRate;

			// Bakiyeyi güncelle (Hesaba döviz eklenir)
			account.Balance += request.Amount;

			// İşlemi geçmişe kaydet (CurrencyTransaction)
			var transaction = new CurrencyTransaction
			{
				CustomerId = request.CustomerId,
				AccountId = request.AccountId,
				CurrencyId = request.CurrencyId,
				Amount = request.Amount,
				TotalRate = exchangeRate.BuyRate,
				TransactionType = "BUY", // Alış
				TransactionDate = DateTime.UtcNow
			};

			_context.CurrencyTransactions.Add(transaction);
			await _context.SaveChangesAsync();

			return Ok(new { Message = "Döviz alış işlemi başarıyla gerçekleştirildi.", Transaction = transaction });
		}

		// 2. DÖVİZ SATIŞ İŞLEMİ (Sell)
		[HttpPost("sell")]
		public async Task<IActionResult> SellCurrency([FromBody] CurrencyTransactionRequest request)
		{
			var account = await _context.Accounts.FirstOrDefaultAsync(a => a.Id == request.AccountId && a.CustomerId == request.CustomerId);
			if (account == null)
			{
				return BadRequest("Hata: Belirtilen müşteri veya hesap bulunamadı!");
			}

			// Bakiye yeterli mi kontrolü
			if (account.Balance < request.Amount)
			{
				return BadRequest("Hata: Hesabınızda bu işlemi yapacak yeterli bakiye bulunmamaktadır!");
			}

			var exchangeRate = await _context.ExchangeRates.FirstOrDefaultAsync(e => e.CurrencyId == request.CurrencyId);
			if (exchangeRate == null)
			{
				return BadRequest("Hata: Bu para birimi için geçerli kur bulunamadı!");
			}

			// Bakiyeden düş
			account.Balance -= request.Amount;

			// İşlemi geçmişe kaydet
			var transaction = new CurrencyTransaction
			{
				CustomerId = request.CustomerId,
				AccountId = request.AccountId,
				CurrencyId = request.CurrencyId,
				Amount = request.Amount,
				TotalRate = exchangeRate.SellRate, // Satış kuru
				TransactionType = "SELL", // Satış
				TransactionDate = DateTime.UtcNow
			};

			_context.CurrencyTransactions.Add(transaction);
			await _context.SaveChangesAsync();

			return Ok(new { Message = "Döviz satış işlemi başarıyla gerçekleştirildi.", Transaction = transaction });
		}

		// 3. TÜM İŞLEM GEÇMİŞİNİ LİSTELEME (GET)
		[HttpGet]
		public async Task<IActionResult> GetTransactions()
		{
			var transactions = await _context.CurrencyTransactions.ToListAsync();
			return Ok(transactions);
		}
	}
}