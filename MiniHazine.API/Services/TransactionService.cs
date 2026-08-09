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

		
		public async Task<bool> ProcessTransactionAsync(int accountId, decimal amount, string transactionType)
		{
			var account = await _context.Accounts.FindAsync(accountId);
			if (account == null) return false;

			if (transactionType == "BUY")
			{
				account.Balance += amount; 
			}
			else if (transactionType == "SELL")
			{
				if (account.Balance < amount) return false; 
				account.Balance -= amount; 
			}

			await _context.SaveChangesAsync();
			return true;
		}
	}
}
