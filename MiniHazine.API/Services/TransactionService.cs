using Microsoft.EntityFrameworkCore;
using MiniHazine.API.Entities;

namespace MiniHazine.API.Services
{
	public class TransactionService
	{
		private readonly AppDbContext _context;

		public TransactionService(AppDbContext context)
		{
			_context = context;
		}

		// Döviz Alım / Satım İşlemi
		public async Task<bool> ProcessTransactionAsync(int accountId, decimal amount, string transactionType)
		{
			var account = await _context.Accounts.FindAsync(accountId);
			if (account == null) return false;

			if (transactionType == "BUY")
			{
				account.Balance += amount; // Alış yapıldığında bakiye artar
			}
			else if (transactionType == "SELL")
			{
				if (account.Balance < amount) return false; // Yetersiz bakiye kontrolü
				account.Balance -= amount; // Satış yapıldığında bakiye düşer
			}

			await _context.SaveChangesAsync();
			return true;
		}
	}
}