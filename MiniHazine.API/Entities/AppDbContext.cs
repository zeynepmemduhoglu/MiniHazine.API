using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;

namespace MiniHazine.API.Entities
{
	public class AppDbContext : DbContext
	{
		public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
		{
		}

		public DbSet<Customer> Customers { get; set; }
		public DbSet<Account> Accounts { get; set; }
		public DbSet<Currency> Currencies { get; set; }
		public DbSet<ExchangeRate> ExchangeRates { get; set; }
		public DbSet<CurrencyTransaction> CurrencyTransactions { get; set; }
		public DbSet<User> Users { get; set; }

		protected override void OnModelCreating(ModelBuilder modelBuilder)
		{
			base.OnModelCreating(modelBuilder);

			modelBuilder.Entity<Currency>().HasData(
				new Currency { Id = 1, Code = "TRY", Name = "Türk Lirası" },
				new Currency { Id = 2, Code = "USD", Name = "Amerikan Doları" },
				new Currency { Id = 3, Code = "EUR", Name = "Euro" }
			);

			modelBuilder.Entity<CurrencyTransaction>()
				.HasOne(t => t.Customer)
				.WithMany()
				.HasForeignKey(t => t.CustomerId)
				.OnDelete(DeleteBehavior.NoAction);

			modelBuilder.Entity<CurrencyTransaction>()
				.HasOne(t => t.Account)
				.WithMany()
				.HasForeignKey(t => t.AccountId)
				.OnDelete(DeleteBehavior.NoAction);

			modelBuilder.Entity<CurrencyTransaction>()
				.HasOne(t => t.Currency)
				.WithMany()
				.HasForeignKey(t => t.CurrencyId)
				.OnDelete(DeleteBehavior.NoAction);
		}
	}
}