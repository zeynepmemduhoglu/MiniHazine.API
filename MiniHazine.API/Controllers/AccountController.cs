using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MiniHazine.API.Entities;

namespace MiniHazine.API.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class AccountController : ControllerBase
	{
		private readonly AppDbContext _context;

		public AccountController(AppDbContext context)
		{
			_context = context;
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
		public async Task<IActionResult> CreateAccount([FromBody] Account account)
		{

			var customerExists = await _context.Customers.AnyAsync(c => c.Id == account.CustomerId);
			if (!customerExists)
			{
				return BadRequest("Hata: Belirtilen müşteri sistemde bulunamadı!");
			}


			var currencyExists = await _context.Currencies.AnyAsync(c => c.Id == account.CurrencyId);
			if (!currencyExists)
			{
				return BadRequest("Hata: Geçersiz para birimi!");
			}


			account.AccountNumber = "ACC-" + new Random().Next(100000, 999999);
			account.CreatedDate = DateTime.UtcNow;

			_context.Accounts.Add(account);
			await _context.SaveChangesAsync();


			return Ok(account);
		}
	}
}