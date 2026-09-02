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
			if (request.Amount <= 0)
			{
				return (false, "Hata: İşlem miktarı 0'dan büyük olmalıdır!", null);
			}

			
			var sourceAccount = await _context.Accounts.FirstOrDefaultAsync(a => a.Id == request.AccountId);
			if (sourceAccount == null)
			{
				return (false, "Hata: Kaynak TL hesabı bulunamadı!", null);
			}

			request.CustomerId = sourceAccount.CustomerId;

			
			var targetAccount = await _context.Accounts.FirstOrDefaultAsync(a => a.Id == request.TargetAccountId);
			if (targetAccount == null)
			{
				return (false, "Hata: Hedef döviz hesabı bulunamadı!", null);
			}

			var exchangeRate = await _context.ExchangeRates.FindAsync(request.CurrencyId);
			if (exchangeRate == null)
			{
				return (false, "Hata: Geçersiz döviz kuru seçimi!", null);
			}


			decimal totalCost = request.Amount * exchangeRate.SellRate;

			if (sourceAccount.Balance < totalCost)
			{
				return (false, "Hata: TL hesabınızda bu işlemi yapacak yeterli bakiye yok yokk", null);
			}



			sourceAccount.Balance -= totalCost;
			targetAccount.Balance += request.Amount; 



			var buyTransaction = new CurrencyTransaction
			{
				CustomerId = request.CustomerId,
				AccountId = request.AccountId,
				TargetAccountId = request.TargetAccountId,
				CurrencyId = exchangeRate.CurrencyId,
				Amount = request.Amount,
				TotalRate = exchangeRate.SellRate,
				TransactionType = "BUY",
				TransactionDate = DateTime.UtcNow,
			};

			_context.CurrencyTransactions.Add(buyTransaction);
			await _context.SaveChangesAsync();

			return (true, "Döviz alış işlemi başarıyla gerçekleştirildi.", buyTransaction);
		}




		public async Task<(bool Success, string Message, CurrencyTransaction? Transaction)> SellCurrencyAsync(DTOCurrencyTransactionRequest request)
		{
			if (request.Amount <= 0)
			{
				return (false, "Hata: İşlem miktarı 0'dan büyük olmalıdır!", null);
			}

			
			var sourceAccount = await _context.Accounts.FirstOrDefaultAsync(a => a.Id == request.AccountId);
			if (sourceAccount == null)
			{
				return (false, "Hata: Satış yapılacak döviz hesabı bulunamadı!", null);
			}
			request.CustomerId = sourceAccount.CustomerId;


			
			var targetAccount = await _context.Accounts.FirstOrDefaultAsync(a => a.Id == request.TargetAccountId);
			if (targetAccount == null)
			{
				return (false, "Hata: Paranın yatacağı hedef TL hesabı bulunamadı!", null);
			}


			var exchangeRate = await _context.ExchangeRates.FindAsync(request.CurrencyId);
			if (exchangeRate == null)
			{
				return (false, "Hata: Geçersiz döviz kuru seçimi", null);
			}




			var totalBought = await _context.CurrencyTransactions
				.Where(t => (t.AccountId == request.AccountId || t.TargetAccountId == request.AccountId) && t.CurrencyId == exchangeRate.CurrencyId && t.TransactionType == "BUY")
				.SumAsync(t => (decimal?)t.Amount) ?? 0;


			var totalSold = await _context.CurrencyTransactions
				.Where(t => (t.AccountId == request.AccountId || t.TargetAccountId == request.AccountId) && t.CurrencyId == exchangeRate.CurrencyId && t.TransactionType == "SELL")
				.SumAsync(t => (decimal?)t.Amount) ?? 0;




			decimal currentCurrencyBalance = totalBought - totalSold;


			if (request.Amount > sourceAccount.Balance) 
			{
				return (false, "Hata: Hesabınızda satmak istediğiniz miktarda bu dövizden yoook", null);
			}



			decimal totalRevenue = request.Amount * exchangeRate.BuyRate; // kullanıcının eline toplam geçecek miktar ( satılmak istenen mktar * bankanın o dövizi alış kuru)

			
			sourceAccount.Balance -= request.Amount; 
			targetAccount.Balance += totalRevenue;   

			var sellTransaction = new CurrencyTransaction
			{
				CustomerId = request.CustomerId,
				AccountId = request.AccountId,
				TargetAccountId = request.TargetAccountId,
				CurrencyId = exchangeRate.CurrencyId,
				Amount = request.Amount,
				TotalRate = exchangeRate.BuyRate,
				TransactionType = "SELL",
				TransactionDate = DateTime.UtcNow
			};

			_context.CurrencyTransactions.Add(sellTransaction);
			await _context.SaveChangesAsync();

			return (true, "Döviz satış işlemi başarıyla gerçekleştirildi.", sellTransaction);
		}
	}
}