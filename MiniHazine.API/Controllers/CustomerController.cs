using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MiniHazine.API.DTOs;
using MiniHazine.API.Entities;
using MiniHazine.API.Services;

namespace MiniHazine.API.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class CustomersController : ControllerBase
	{
		private readonly CustomerService _customerService;
		private readonly AppDbContext _context;

		public CustomersController(CustomerService customerService, AppDbContext context)
		{
			_customerService = customerService;
			_context = context;
		}

		[HttpGet]
		public async Task<IActionResult> GetCustomers()
		{
			var customers = await _customerService.GetCustomersAsync();
			return Ok(customers);
		}

		[HttpPost]
		public async Task<IActionResult> CreateCustomer([FromBody] DTOCustomer request)
		{
			try
			{
				var createdCustomer = await _customerService.CreateCustomerAsync(request);
				return Ok(new { Message = "Müşteri başarıyla oluşturuldu.", Customer = createdCustomer });
			}
			catch (ArgumentException ex)
			{
				return BadRequest(new { Message = ex.Message });
			}
			catch (InvalidOperationException ex)
			{
				return BadRequest(new { Message = ex.Message });
			}
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