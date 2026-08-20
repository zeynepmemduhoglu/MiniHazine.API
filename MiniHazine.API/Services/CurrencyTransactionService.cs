using Microsoft.EntityFrameworkCore;
using MiniHazine.API.DTOs;
using MiniHazine.API.Entities;

namespace MiniHazine.API.Services
{
	public class CurrencyTransactionService
	{
		private readonly AppDbContext _context;

		public CurrencyTransactionService(AppDbContext context)
		{
			_context = context;
		}

		public async Task<(bool Success, string Message, CurrencyTransaction? Transaction)> BuyCurrencyAsync(DTOCurrencyTransactionRequest request)
		{

		
			var account = await _context.Accounts.FirstOrDefaultAsync(a => a.Id == request.AccountId && a.CustomerId == request.CustomerId);
			if (account == null)
			{
				return (false, "Hata: Belirtilen müşteri veya hesap bulunamadı!", null);
			}

			var currency = await _context.Currencies.FindAsync(request.CurrencyId);
			if (currency == null)
			{
				return (false, "Hata: Geçersiz para birimi!", null);
			}

			var exchangeRate = await _context.ExchangeRates.FirstOrDefaultAsync(e => e.Pair.Contains(currency.Code));
			if (exchangeRate == null)
			{
				return (false, "Hata: Bu para birimi için geçerli kur bulunamadı!", null);
			}

			decimal totalCost = request.Amount * exchangeRate.BuyRate;

			
			account.Balance += request.Amount;

			var buyTransaction = new CurrencyTransaction
			{
				CustomerId = request.CustomerId,
				AccountId = request.AccountId,
				CurrencyId = request.CurrencyId,
				Amount = request.Amount,
				TotalRate = exchangeRate.BuyRate,
				TransactionType = "BUY",
				TransactionDate = DateTime.UtcNow
			};

			_context.CurrencyTransactions.Add(buyTransaction);
			await _context.SaveChangesAsync();

			return (true, "Döviz alış işlemi başarıyla gerçekleştirildi.", buyTransaction);
		}

		public async Task<(bool Success, string Message, CurrencyTransaction? Transaction)> SellCurrencyAsync(DTOCurrencyTransactionRequest request)
		{
			var account = await _context.Accounts.FirstOrDefaultAsync(a => a.Id == request.AccountId && a.CustomerId == request.CustomerId);
			if (account == null)
			{
				return (false, "Hata: Belirtilen müşteri veya hesap bulunamadı!", null);
			}

			if (account.Balance < request.Amount)
			{
				return (false, "Hata: Hesabınızda bu işlemi yapacak yeterli bakiye bulunamadı!", null);
			}

			var currency = await _context.Currencies.FindAsync(request.CurrencyId);
			if (currency == null)
			{
				return (false, "Hata: Geçersiz para birimi!", null);
			}

			var exchangeRate = await _context.ExchangeRates.FirstOrDefaultAsync(e => e.Pair.Contains(currency.Code));
			if (exchangeRate == null)
			{
				return (false, "Hata: Bu para birimi için geçerli kur bulunamadı!", null);
			}

			account.Balance -= request.Amount;

			var sellTransaction = new CurrencyTransaction
			{
				CustomerId = request.CustomerId,
				AccountId = request.AccountId,
				CurrencyId = request.CurrencyId,
				Amount = request.Amount,
				TotalRate = exchangeRate.SellRate,
				TransactionType = "SELL",
				TransactionDate = DateTime.UtcNow
			};

			_context.CurrencyTransactions.Add(sellTransaction);
			await _context.SaveChangesAsync();

			return (true, "Döviz satış işlemi başarıyla gerçekleştirildi.", sellTransaction);
		}
	}
}