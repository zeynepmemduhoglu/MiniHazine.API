using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MiniHazine.API.DTOs;
using MiniHazine.API.Entities;

namespace MiniHazine.API.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class AccountsController : ControllerBase
	{
		private readonly AppDbContext _context;

		public AccountsController(AppDbContext context)
		{
			_context = context;
		}

		[HttpGet]
		public async Task<IActionResult> GetAccounts()
		{
			var accounts = await _context.Accounts
				.Include(c => c.Currency)
				.Include(c => c.Customer)
				.Select(c => new
				{
					id = c.Id,
					customerId = c.CustomerId,
					currencyId = c.CurrencyId,
					customerName = c.Customer != null ? c.Customer.FirstName + " " + c.Customer.LastName : "Bilinmiyor",
					accountName = !string.IsNullOrEmpty(c.AccountName) ? c.AccountName : "Standart Hesap",
					accountNumber = c.AccountNumber,
					balance = c.Balance,
					currency = c.Currency != null ? c.Currency.Code : "TRY"
				})
				.ToListAsync();

			return Ok(accounts);
		}

		[HttpGet("customer/{customerId}")]
		public async Task<IActionResult> GetAccountsByCustomer(int customerId)
		{
			var accounts = await _context.Accounts
				.Where(a => a.CustomerId == customerId)
				.ToListAsync();

			return Ok(accounts);
		}

		[HttpPost]
		public async Task<IActionResult> CreateAccount([FromBody] DTOAccountCreate request)
		{
			var customerExists = await _context.Customers.AnyAsync(c => c.Id == request.CustomerId);
			if (!customerExists)
			{
				return BadRequest(new { Message = "Hata: Belirtilen müşteri sistemde bulunamadı!" });
			}

			var currencyExists = await _context.Currencies.AnyAsync(c => c.Id == request.CurrencyId);
			if (!currencyExists)
			{
				return BadRequest(new { Message = "Hata: Geçersiz para birimi!" });
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

			return Ok(new { Message = "Hesap başarıyla oluşturuldu.", Account = account });
		}

		[HttpPut("{id}")]
		public async Task<IActionResult> UpdateAccount(int id, [FromBody] DTOAccountCreate request)
		{
			var account = await _context.Accounts.FindAsync(id);
			if (account == null)
			{
				return NotFound(new { Message = "Hata: Hesap bulunamadı!" });
			}

			var currencyExists = await _context.Currencies.AnyAsync(c => c.Id == request.CurrencyId);
			if (!currencyExists)
			{
				return BadRequest(new { Message = "Hata: Geçersiz para birimi!" });
			}

			account.CustomerId = request.CustomerId ?? account.CustomerId;
			account.AccountName = request.AccountName;
			account.Balance = request.Balance;
			account.CurrencyId = request.CurrencyId;

			await _context.SaveChangesAsync();

			return Ok(new { Message = "Hesap başarıyla güncellendi.", Account = account });
		}

		[HttpDelete("{id}")]
		public async Task<IActionResult> DeleteAccount(int id)
		{
			var account = await _context.Accounts.FindAsync(id);
			if (account == null)
			{
				return NotFound(new { Message = "Hata: Hesap bulunamadı!" });
			}

			try
			{
				var relatedTransactions = await _context.CurrencyTransactions
					.Where(t => t.AccountId == id)
					.ToListAsync();

				if (relatedTransactions.Any())
				{
					_context.CurrencyTransactions.RemoveRange(relatedTransactions);
				}

				_context.Accounts.Remove(account);
				await _context.SaveChangesAsync();

				return Ok(new { Message = "Hesap ve bağlı işlemleri başarıyla silindi." });
			}
			catch (Exception ex)
			{
				return BadRequest(new { Message = "Hesap silinirken bir hata oluştu.", Details = ex.Message });
			}
		}
	}
}