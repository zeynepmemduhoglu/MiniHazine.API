using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MiniHazine.API.DTOs;
using MiniHazine.API.Entities;

namespace MiniHazine.API.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class CustomersController : ControllerBase
	{
		private readonly AppDbContext _context;

		public CustomersController(AppDbContext context)
		{
			_context = context;
		}

		[HttpGet]
		public async Task<IActionResult> GetCustomers()
		{
			var customers = await _context.Customers
				.Select(c => new DTOCustomer
				{
					CustomerId = c.Id,
					FirstName = c.FirstName,
					LastName = c.LastName,
					Email = c.Email,
					IdentityNumber = c.IdentityNumber,
					PhoneNumber = c.PhoneNumber
				})
				.ToListAsync();

			return Ok(customers);
		}

		[HttpPost]
		public async Task<IActionResult> CreateCustomer([FromBody] DTOCustomer request)
		{
			var customer = new Customer
			{
				FirstName = request.FirstName,
				LastName = request.LastName,
				Email = request.Email,
				IdentityNumber = request.IdentityNumber,
				PhoneNumber = request.PhoneNumber,
				IsActive = true
			};

			_context.Customers.Add(customer);
			await _context.SaveChangesAsync();

			request.CustomerId = customer.Id;

			return Ok(new { Message = "Müşteri başarıyla oluşturuldu.", Customer = request });
		}

		
		[HttpDelete("{id}")]
		public async Task<IActionResult> DeleteCustomer(int id)
		{
			var customer = await _context.Customers.FindAsync(id);
			if (customer == null)
			{
				return NotFound(new { Message = "Müşteri bulunamadı." });
			}

			_context.Customers.Remove(customer);
			await _context.SaveChangesAsync();

			return Ok(new { Message = "Müşteri başarıyla silindi." });
		}

		
		[HttpPut("{id}")]
		public async Task<IActionResult> UpdateCustomer(int id, [FromBody] DTOCustomer request)
		{
			var customer = await _context.Customers.FindAsync(id);
			if (customer == null)
			{
				return NotFound(new { Message = "Müşteri bulunamadı." });
			}

			customer.FirstName = request.FirstName;
			customer.LastName = request.LastName;
			customer.Email = request.Email;
			customer.IdentityNumber = request.IdentityNumber;
			customer.PhoneNumber = request.PhoneNumber;

			await _context.SaveChangesAsync();

			return Ok(new { Message = "Müşteri başarıyla güncellendi." });
		}
	}
}