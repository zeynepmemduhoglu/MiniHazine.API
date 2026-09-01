using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MiniHazine.API.Entities;
using System.Globalization;
using System.Text.Json;

namespace MiniHazine.API.Controllers
{
	[Route("api/precious-metals")]
	[ApiController]
	public class PreciousMetalsController : ControllerBase
	{
		private readonly AppDbContext _context;

		public PreciousMetalsController(AppDbContext context)
		{
			_context = context;
		}

		[HttpGet]
		public async Task<IActionResult> GetPreciousMetals()
		{
			var metals = await _context.PreciousMetalRates.ToListAsync();
			return Ok(metals);
		}

		[HttpPost]
		public async Task<IActionResult> CreatePreciousMetal([FromBody] PreciousMetalRate preciousMetalRate)
		{
			if (preciousMetalRate == null)
			{
				return BadRequest("Gönderilen veriler boş olamaz.");
			}

			preciousMetalRate.UpdatedDate = DateTime.UtcNow;
			_context.PreciousMetalRates.Add(preciousMetalRate);
			await _context.SaveChangesAsync();

			return Ok(preciousMetalRate);
		}

		[HttpPost("fetch-live")]
		public async Task<IActionResult> FetchAndSaveLivePreciousMetals()
		{
			try
			{
				using var client = new HttpClient();
				string url = "https://finans.truncgil.com/today.json";

				var jsonString = await client.GetStringAsync(url);
				using var doc = JsonDocument.Parse(jsonString);
				var root = doc.RootElement;

				var targets = new Dictionary<string, string>
				{
					{ "gram-altin", "XAU/TRY" },
					{ "gumus", "XAG/TRY" }
				};

				foreach (var target in targets)
				{
					if (root.TryGetProperty(target.Key, out var metalElement))
					{
						string buyStr = metalElement.GetProperty("Alış").GetString();
						string sellStr = metalElement.GetProperty("Satış").GetString();

						if (!string.IsNullOrEmpty(buyStr) && !string.IsNullOrEmpty(sellStr) &&
							decimal.TryParse(buyStr.Replace(".", "").Replace(",", "."), NumberStyles.Any, CultureInfo.InvariantCulture, out decimal buyRate) &&
							decimal.TryParse(sellStr.Replace(".", "").Replace(",", "."), NumberStyles.Any, CultureInfo.InvariantCulture, out decimal sellRate))
						{
							string pair = target.Value;
							var existingMetal = await _context.PreciousMetalRates.FirstOrDefaultAsync(x => x.Pair == pair);

							if (existingMetal != null)
							{
								existingMetal.BuyRate = buyRate;
								existingMetal.SellRate = sellRate;
								existingMetal.UpdatedDate = DateTime.UtcNow;
							}
							else
							{
								_context.PreciousMetalRates.Add(new PreciousMetalRate
								{
									Pair = pair,
									BuyRate = buyRate,
									SellRate = sellRate,
									UpdatedDate = DateTime.UtcNow
								});
							}
						}
					}
				}

				await _context.SaveChangesAsync();
				return Ok(new { Message = "Canlı kıymetli maden kurları başarıyla güncellendi!" });
			}
			catch (Exception ex)
			{
				return StatusCode(500, $"Kıymetli madenler çekilirken bir hata oluştu: {ex.Message}");
			}
		}

		[HttpDelete("clear-all")]
		public async Task<IActionResult> ClearAllPreciousMetals()
		{
			var invalidItems = await _context.PreciousMetalRates
				.Where(x => x.Pair == "string" || string.IsNullOrEmpty(x.Pair))
				.ToListAsync();

			if (invalidItems.Any())
			{
				_context.PreciousMetalRates.RemoveRange(invalidItems);
				await _context.SaveChangesAsync();
			}

			return Ok(new { Message = "hatalı  ve boş kayıtlar temizlendi!" });
		}
	}
}