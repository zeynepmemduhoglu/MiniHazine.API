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


		//fluentvalidasyon0

		public async Task<DTOCustomer> CreateCustomerAsync(DTOCustomer request)
		{
			var trimmedIdentity = request.IdentityNumber?.Trim();
			var trimmedPhone = request.PhoneNumber?.Trim();

			
			if (string.IsNullOrWhiteSpace(trimmedIdentity) || trimmedIdentity.Length != 11)
			{
				throw new ArgumentException("TC Kimlik numarasi eksik veya 11 haneden farkli olamaz.");
			}

			
			if (string.IsNullOrWhiteSpace(trimmedPhone) || (trimmedPhone.Length != 10 && trimmedPhone.Length != 11))
			{
				throw new ArgumentException("Telefon numarasi eksik ya da eksik/fazla haneli olamaz (10 veya 11 hane olmalidir).");
			}

			
			var existingCustomerByIdentity = await _context.Customers
				.FirstOrDefaultAsync(c => c.IdentityNumber == trimmedIdentity);

			if (existingCustomerByIdentity != null)
			{
				throw new InvalidOperationException("Bu TC Kimlik numarasina sahip bir musteri zaten sistemde kayitli.");
			}

			
			var existingCustomerByPhone = await _context.Customers
				.FirstOrDefaultAsync(c => c.PhoneNumber == trimmedPhone);

			if (existingCustomerByPhone != null)
			{
				throw new InvalidOperationException("Bu telefon numarasina sahip bir musteri zaten sistemde kayitli.");
			}

			var customer = new Customer
			{
				FirstName = request.FirstName,
				LastName = request.LastName,
				Email = request.Email,
				IdentityNumber = trimmedIdentity,
				PhoneNumber = trimmedPhone,
				IsActive = true
			};

			_context.Customers.Add(customer);
			await _context.SaveChangesAsync();

			request.CustomerId = customer.Id;
			return request;
		}
	}
}