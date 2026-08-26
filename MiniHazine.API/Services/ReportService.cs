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
				.Select(a => new
				{
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

		public async Task<List<CustomerTransactionReportDto>> GetCustomerTransactionReportAsync()
		{
			if (_context.Customers == null) return new List<CustomerTransactionReportDto>();

			var customers = await _context.Customers
				.Include(c => c.Accounts)
				.ThenInclude(a => a.CurrencyTransactions)
				.ToListAsync();

			if (customers == null || !customers.Any())
			{
				return new List<CustomerTransactionReportDto>();
			}

			var reportList = new List<CustomerTransactionReportDto>();

			foreach (var customer in customers)
			{
				var allTransactions = customer.Accounts?
					.SelectMany(a => a.CurrencyTransactions ?? new List<CurrencyTransaction>())
					.Where(t => t != null)
					.ToList() ?? new List<CurrencyTransaction>();

				reportList.Add(new CustomerTransactionReportDto
				{
					CustomerId = customer.Id,
					CustomerName = $"{customer.FirstName} {customer.LastName}",
					TotalAccountCount = customer.Accounts?.Count ?? 0,
					TotalTransactionCount = allTransactions.Count,
					TotalBuyAmount = allTransactions.Where(t => t.TransactionType == "BUY").Sum(t => t.Amount),
					TotalSellAmount = allTransactions.Where(t => t.TransactionType == "SELL").Sum(t => t.Amount)
				});
			}

			return reportList;
		}

		
		public async Task<List<DateRangeReportResponseDto>> GetTransactionsByDateRangeAsync(DateRangeReportRequestDto request)
		{
			var query = _context.CurrencyTransactions
				.Include(t => t.Account)
				.ThenInclude(a => a.Customer)
				.AsQueryable();

			
			query = query.Where(t => t.TransactionDate >= request.StartDate && t.TransactionDate <= request.EndDate);

			
			if (request.AccountId.HasValue)
			{
				query = query.Where(t => t.AccountId == request.AccountId.Value);
			}

			var result = await query
				.Select(t => new DateRangeReportResponseDto
				{
					Id = t.Id,
					TransactionDate = t.TransactionDate,
					Amount = t.Amount,
					TotalRate = t.TotalRate,
					AccountNumber = t.Account.AccountNumber,
					CurrencyCode = t.Account.Currency.Code
				})
				.ToListAsync();

			return result;
		}
	}
}