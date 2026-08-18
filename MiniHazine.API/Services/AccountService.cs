using Microsoft.EntityFrameworkCore;
using MiniHazine.API.DTOs;
using MiniHazine.API.Entities;

namespace MiniHazine.API.Services
{
	public class AccountService
	{
		private readonly AppDbContext _context;

		public AccountService(AppDbContext context)
		{
			_context = context;
		}

		public async Task<IEnumerable<Account>> GetAccountsByCustomerAsync(int customerId)
		{
			return await _context.Accounts
				.Where(a => a.CustomerId == customerId)
				.ToListAsync();
		}

		public async Task<(bool Success, string Message, Account Account)> CreateAccountAsync(DTOAccountCreate request)
		{
			var customerExists = await _context.Customers.AnyAsync(c => c.Id == request.CustomerId);
			if (!customerExists)
			{
				return (false, "Hata: Belirtilen müşteri sistemde bulunamadı!", null);
			}

			var currencyExists = await _context.Currencies.AnyAsync(c => c.Id == request.CurrencyId);
			if (!currencyExists)
			{
				return (false, "Hata: Geçersiz para birimi!", null);
			}

			var account = new Account
			{
				CustomerId = (int)request.CustomerId,
				AccountName = request.AccountName, 
				Balance = request.Balance,
				CurrencyId = request.CurrencyId,
				AccountNumber = "ACC-" + new Random().Next(100000, 999999),
				CreatedDate = DateTime.UtcNow
			};

			_context.Accounts.Add(account);
			await _context.SaveChangesAsync();

			return (true, "Hesap başarıyla oluşturuldu.", account);
		}
	}
}