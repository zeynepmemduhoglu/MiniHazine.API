using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using MiniHazine.API.Entities;
using System.Globalization;
using System.Xml.Linq;

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
                
                
                string url = "https://www.tcmb.gov.tr/kurlar/today.xml";

                var xmlString = await client.GetStringAsync(url);
                var xmlDoc = XDocument.Parse(xmlString);

                
                var currencyElements = xmlDoc.Descendants("Currency");

                foreach (var item in currencyElements)
                {
                    string code = item.Attribute("Kod")?.Value;
                    if (string.IsNullOrEmpty(code)) continue;

                    
                    int unit = 1;
                    if (int.TryParse(item.Element("Unit")?.Value, out var u))
                    {
                        unit = u;
                    }

                    string buyStr = item.Element("ForexBuying")?.Value;
                    string sellStr = item.Element("ForexSelling")?.Value;

                    
                    if (!string.IsNullOrEmpty(buyStr) && !string.IsNullOrEmpty(sellStr) &&
                        decimal.TryParse(buyStr, NumberStyles.Any, CultureInfo.InvariantCulture, out decimal buyRaw) &&
                        decimal.TryParse(sellStr, NumberStyles.Any, CultureInfo.InvariantCulture, out decimal sellRaw))
                    {
                        
                        decimal buyRate = buyRaw / unit;
                        decimal sellRate = sellRaw / unit;

                        string pair = $"{code}/TRY";

                        
                        int currencyId = code switch
                        {
                            "USD" => 1,
                            "EUR" => 3,
                            "GBP" => 4,
                            "JPY" => 5,
                            "CAD" => 6,
                            "CHF" => 7,
                            "AUD" => 8,
                            "SEK" => 10,
                            _ => 0
                        };

                        if (currencyId == 0) continue; 

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
                return Ok(new { Message = "TCMB canlı kurları başarıyla güncellendi!" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"TCMB kurları çekilirken bir hata oluştu: {ex.Message}");
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