using Microsoft.EntityFrameworkCore;
using MiniHazine.API.DTOs;
using MiniHazine.API.Entities;

namespace MiniHazine.API.Services
{
	public class ReportService
	{
		private readonly AppDbContext _context;

		public ReportService(AppDbContext context)
		{
			_context = context;
		}

		public async Task<ReportSummaryDto> GetReportSummaryAsync()
		{
			var totalCustomers = _context.Customers != null ? await _context.Customers.CountAsync() : 0;
			var totalAccounts = _context.Accounts != null ? await _context.Accounts.CountAsync() : 0;

			var totalBalance = _context.Accounts != null
				? await _context.Accounts.SumAsync(a => (decimal?)(a != null ? a.Balance : 0)) ?? 0
				: 0;

			var transactions = _context.CurrencyTransactions != null
				? await _context.CurrencyTransactions.ToListAsync()
				: new List<CurrencyTransaction>();

			var totalTransactions = transactions.Count;

			var totalBuyVolume = transactions
				.Where(t => t != null && t.TransactionType == "BUY")
				.Sum(t => t.Amount);

			var totalSellVolume = transactions
				.Where(t => t != null && t.TransactionType == "SELL")
				.Sum(t => t.Amount);

			return new ReportSummaryDto
			{
				TotalCustomers = totalCustomers,
				TotalAccounts = totalAccounts,
				TotalBalance = totalBalance,
				TotalTransactions = totalTransactions,
				TotalBuyVolume = totalBuyVolume,
				TotalSellVolume = totalSellVolume
			};
		}

		public async Task<List<CurrencyBalanceDto>> GetCurrencyDistributionAsync()
		{
			if (_context.Accounts == null) return new List<CurrencyBalanceDto>();

			
			var accountsData = await _context.Accounts
				.Where(a => a != null)
				.Select(a => new {
					CurrencyName = a.Currency != null ? a.Currency.Code : "Bilinmeyen",
					Balance = a.Balance
				})
				.ToListAsync();

			if (accountsData == null || !accountsData.Any())
			{
				return new List<CurrencyBalanceDto>();
			}

			
			var distribution = accountsData
				.GroupBy(x => x.CurrencyName)
				.Select(g => new CurrencyBalanceDto
				{
					CurrencyCode = g.Key,
					TotalBalance = g.Sum(x => x.Balance),
					AccountCount = g.Count()
				})
				.ToList();

			return distribution;
		}
	}
}