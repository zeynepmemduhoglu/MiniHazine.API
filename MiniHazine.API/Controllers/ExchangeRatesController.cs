using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MiniHazine.API.Entities;

namespace MiniHazine.API.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class ExchangeRatesController : ControllerBase
	{
		private readonly AppDbContext _context;

		public ExchangeRatesController(AppDbContext context)
		{
			_context = context;
		}
		
		[HttpGet]
		public async Task<IActionResult> GetExchangeRates()
		{
			var rates = await _context.ExchangeRates.ToListAsync();
			return Ok(rates);
		}

		
		[HttpPost]
		public async Task<IActionResult> CreateExchangeRate([FromBody] ExchangeRate exchangeRate)
		{
			exchangeRate.UpdatedDate = DateTime.UtcNow;

			_context.ExchangeRates.Add(exchangeRate);
			await _context.SaveChangesAsync();

			return Ok(exchangeRate);
		}
	}
}