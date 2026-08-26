using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace MiniHazine.API.Entities
{
	public class AccountConfiguration : IEntityTypeConfiguration<Account>
	{
		public void Configure(EntityTypeBuilder<Account> builder)
		{
			
			builder.HasMany(a => a.CurrencyTransactions)
				   .WithOne(t => t.Account) // buraya dikkatt
				   .HasForeignKey(t => t.AccountId)
				   .OnDelete(DeleteBehavior.Cascade);

			
			builder.Property(a => a.Balance)
				   .HasColumnType("decimal(18,2)");
		}
	}
}