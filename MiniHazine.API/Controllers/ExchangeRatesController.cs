using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using MiniHazine.API.Entities;
using System.Text.Json;

namespace MiniHazine.API.Controllers
{
	[Route("api/exchange-rates")]
	[ApiController]
	public class ExchangeRatesController : ControllerBase
	{
		private readonly AppDbContext _context;
		private readonly IConfiguration _configuration;

		public ExchangeRatesController(AppDbContext context, IConfiguration configuration)
		{
			_context = context;
			_configuration = configuration;
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
			if (exchangeRate == null)
			{
				return BadRequest("Gönderilen veriler boş olamaz.");
			}

			exchangeRate.UpdatedDate = DateTime.UtcNow;

			_context.ExchangeRates.Add(exchangeRate);
			await _context.SaveChangesAsync();

			return Ok(exchangeRate);
		}

		[HttpPost("fetch-live")]
		public async Task<IActionResult> FetchAndSaveLiveRates()
		{
			try
			{
				using var client = new HttpClient();

				string url = _configuration["ApiSettings:FrankfurterUrl"];

				if (string.IsNullOrEmpty(url))
				{
					return BadRequest("Hata: Dış servis URL konfigürasyonu bulunamadı.");
				}

				var response = await client.GetAsync(url);
				if (!response.IsSuccessStatusCode)
				{
					return BadRequest("Dış API'den kurlar alınamadı.");
				}

				var jsonString = await response.Content.ReadAsStringAsync();

				using var doc = JsonDocument.Parse(jsonString);
				var root = doc.RootElement;
				var ratesElement = root.GetProperty("rates");

				string[] currencies = { "TRY", "EUR", "GBP", "JPY", "CAD", "CHF", "AUD", "RUB", "SEK" };

				foreach (var currency in currencies)
				{
					if (ratesElement.TryGetProperty(currency, out var rateElement))
					{
						decimal rate = rateElement.GetDecimal();
						string pair = $"USD/{currency}";

						decimal buyRate = rate;
						decimal sellRate = rate * 1.01m;

						int currencyId = currency switch
						{
							"TRY" => 2,
							"EUR" => 3,
							"GBP" => 4,
							"JPY" => 5,
							"CAD" => 6,
							"CHF" => 7,
							"AUD" => 8,
							"RUB" => 9,
							"SEK" => 10,
							_ => 1
						};

						var existingRate = await _context.ExchangeRates.FirstOrDefaultAsync(x => x.Pair == pair);

						if (existingRate != null)
						{
							existingRate.BuyRate = buyRate;
							existingRate.SellRate = sellRate;
							existingRate.UpdatedDate = DateTime.Now;
						}
						else
						{
							_context.ExchangeRates.Add(new ExchangeRate
							{
								CurrencyId = currencyId,
								Pair = pair,
								BuyRate = buyRate,
								SellRate = sellRate,
								UpdatedDate = DateTime.UtcNow
							});
						}
					}
				}

				await _context.SaveChangesAsync();
				return Ok(new { Message = "Seçili tüm canlı kurlar başarıyla güncellendi!" });
			}
			catch (Exception ex)
			{
				return StatusCode(500, $"Bir hata oluştu: {ex.Message}");
			}
		}

		[HttpDelete("clear-all")]
		public async Task<IActionResult> ClearAllRates()
		{
			_context.ExchangeRates.RemoveRange(_context.ExchangeRates);
			await _context.SaveChangesAsync();
			return Ok(new { Message = "Tablodaki tüm eski veriler başarıyla temizlendi!" });
		}
	}
}