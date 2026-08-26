using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace MiniHazine.API.Entities
{
	public class CustomerConfiguration : IEntityTypeConfiguration<Customer>
	{
		public void Configure(EntityTypeBuilder<Customer> builder)
		{
			
			builder.HasMany(c => c.Accounts)
				   .WithOne(a => a.Customer)
				   .HasForeignKey(a => a.CustomerId)
				   .OnDelete(DeleteBehavior.Cascade);
		}
	}
}