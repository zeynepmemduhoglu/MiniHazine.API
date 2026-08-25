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

		public async Task<List<DTOCurrencyTransactionDto>> GetTransactionsAsync()
		{
			var result = await _context.CurrencyTransactions
			
				.OrderByDescending(t => t.TransactionDate)
				.Select(t => new DTOCurrencyTransactionDto  
				{
					Id = t.Id,
					TransactionType = t.TransactionType,
					Amount = t.Amount,
					TotalRate = t.TotalRate,
					TransactionDate = t.TransactionDate,
					AccountId = t.AccountId,
					Account = t.Account, 
					AccountType = t.Account != null ? t.Account.AccountName : "Bilinmeyen Hesap",
					CustomerName = t.Account != null && t.Account.Customer != null
						? $"{t.Account.Customer.FirstName} {t.Account.Customer.LastName}"
						: "Bilinmeyen Müşteri",
					CurrencyCode = t.Currency != null ? t.Currency.Code : ""
				})
				.ToListAsync();




			return result;
		}

		public async Task<(bool Success, string Message, CurrencyTransaction? Transaction)> BuyCurrencyAsync(DTOCurrencyTransactionRequest request)
		{
			var account = await _context.Accounts.FirstOrDefaultAsync(a => a.Id == request.AccountId);
			if (account == null)
			{
				return (false, "Hata: Belirtilen hesap bulunamadı!", null);
			}

			request.CustomerId = account.CustomerId;

			var exchangeRate = await _context.ExchangeRates.FindAsync(request.CurrencyId);
			if (exchangeRate == null)
			{
				return (false, "Hata: Geçersiz döviz kuru seçimi!", null);
			}

			decimal totalCost = request.Amount * exchangeRate.BuyRate;

			account.Balance += request.Amount;

			var buyTransaction = new CurrencyTransaction
			{
				CustomerId = request.CustomerId,
				AccountId = request.AccountId,
				CurrencyId = exchangeRate.CurrencyId,
				Amount = request.Amount,
				TotalRate = exchangeRate.BuyRate,
				TransactionType = "BUY",
				TransactionDate = DateTime.UtcNow,
			};

			_context.CurrencyTransactions.Add(buyTransaction);
			await _context.SaveChangesAsync();

			return (true, "Döviz alış işlemi başarıyla gerçekleştirildi.", buyTransaction);
		}

		public async Task<(bool Success, string Message, CurrencyTransaction? Transaction)> SellCurrencyAsync(DTOCurrencyTransactionRequest request)
		{
			var account = await _context.Accounts.FirstOrDefaultAsync(a => a.Id == request.AccountId);
			if (account == null)
			{
				return (false, "Hata: Belirtilen hesap bulunamadı!", null);
			}

			request.CustomerId = account.CustomerId;

			if (account.Balance < request.Amount)
			{
				return (false, "Hata: Hesabınızda bu işlemi yapacak yeterli bakiye bulunamadı!", null);
			}

			var exchangeRate = await _context.ExchangeRates.FindAsync(request.CurrencyId);
			if (exchangeRate == null)
			{
				return (false, "Hata: Geçersiz döviz kuru seçimi!", null);
			}

			account.Balance -= request.Amount;

			var sellTransaction = new CurrencyTransaction
			{
				CustomerId = request.CustomerId,
				AccountId = request.AccountId,
				CurrencyId = exchangeRate.CurrencyId,
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