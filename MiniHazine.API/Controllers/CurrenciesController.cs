using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MiniHazine.API.Entities;

namespace MiniHazine.API.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class CurrenciesController : ControllerBase
	{
		private readonly AppDbContext _context;

		
		public CurrenciesController(AppDbContext context)
		{
			_context = context;
		}

		
		[HttpGet]
		public async Task<ActionResult<IEnumerable<Currency>>> GetCurrencies()
		{
			return await _context.Currencies.ToListAsync();
		}
	}
}