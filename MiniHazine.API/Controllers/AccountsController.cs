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
				.Include(c => c.Customer) // Müşteri ilişkisini dahil ettik
				.Select(c => new
				{
					id = c.Id,
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
	}
}