using Microsoft.EntityFrameworkCore;
using MiniHazine.API.DTOs;
using MiniHazine.API.Entities;

namespace MiniHazine.API.Services
{
	public class CustomerService
	{
		private readonly AppDbContext _context;

		public CustomerService(AppDbContext context)
		{
			_context = context;
		}

		
		public async Task<IEnumerable<DTOCustomer>> GetCustomersAsync()
		{
			return await _context.Customers
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
		}

		
		public async Task<DTOCustomer> CreateCustomerAsync(DTOCustomer request)
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
			return request;
		}
	}
}