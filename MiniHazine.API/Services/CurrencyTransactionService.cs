using Microsoft.EntityFrameworkCore;
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

		
		public async Task<(bool Success, string Message, CurrencyTransaction? Transaction)> BuyCurrencyAsync(CurrencyTransactionRequest request)
		{
			var account = await _context.Accounts.FirstOrDefaultAsync(a => a.Id == request.AccountId && a.CustomerId == request.CustomerId);
			if (account == null)
			{
				return (false, "Hata: Belirtilen müşteri veya hesap bulunamadı!", null);
			}

			var exchangeRate = await _context.ExchangeRates.FirstOrDefaultAsync(e => e.CurrencyId == request.CurrencyId);
			if (exchangeRate == null)
			{
				return (false, "Hata: Bu para birimi için geçerli kur bulunamadı!", null);
			}

			decimal totalCost = request.Amount * exchangeRate.BuyRate;
			account.Balance += request.Amount;

			var transaction = new CurrencyTransaction
			{
				CustomerId = request.CustomerId,
				AccountId = request.AccountId,
				CurrencyId = request.CurrencyId,
				Amount = request.Amount,
				TotalRate = exchangeRate.BuyRate,
				TransactionType = "BUY",
				TransactionDate = DateTime.UtcNow
			};

			_context.CurrencyTransactions.Add(transaction);
			await _context.SaveChangesAsync();

			return (true, "Döviz alış işlemi başarıyla gerçekleştirildi.", transaction);
		}

	
		public async Task<(bool Success, string Message, CurrencyTransaction? Transaction)> SellCurrencyAsync(CurrencyTransactionRequest request)
		{
			var account = await _context.Accounts.FirstOrDefaultAsync(a => a.Id == request.AccountId && a.CustomerId == request.CustomerId);
			if (account == null)
			{
				return (false, "Hata: Belirtilen müşteri veya hesap bulunamadı!", null);
			}

			if (account.Balance < request.Amount)
			{
				return (false, "Hata: Hesabınızda bu işlemi yapacak yeterli bakiye bulunmamaktadır!", null);
			}

			var exchangeRate = await _context.ExchangeRates.FirstOrDefaultAsync(e => e.CurrencyId == request.CurrencyId);
			if (exchangeRate == null)
			{
				return (false, "Hata: Bu para birimi için geçerli kur bulunamadı!", null);
			}

			account.Balance -= request.Amount;

			var transaction = new CurrencyTransaction
			{
				CustomerId = request.CustomerId,
				AccountId = request.AccountId,
				CurrencyId = request.CurrencyId,
				Amount = request.Amount,
				TotalRate = exchangeRate.SellRate,
				TransactionType = "SELL",
				TransactionDate = DateTime.UtcNow
			};

			_context.CurrencyTransactions.Add(transaction);
			await _context.SaveChangesAsync();

			return (true, "Döviz satış işlemi başarıyla gerçekleştirildi.", transaction);
		}
	}
}