using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
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
		public async Task<ActionResult<IEnumerable<Customer>>> GetCustomers()
		{
			return await _context.Customers.ToListAsync();
		}

		
		[HttpPost]
		public async Task<ActionResult<Customer>> CreateCustomer(Customer customer)
		{
			_context.Customers.Add(customer);
			await _context.SaveChangesAsync();

			return CreatedAtAction(nameof(GetCustomers), new { id = customer.Id }, customer);
		}
	}
}