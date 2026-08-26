using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace MiniHazine.API.Entities
{
	public class CurrencyTransactionConfiguration : IEntityTypeConfiguration<CurrencyTransaction>
	{
		public void Configure(EntityTypeBuilder<CurrencyTransaction> builder)
		{
			
			builder.Property(t => t.Amount)
				   .HasColumnType("decimal(18,2)");

			
			builder.Property(t => t.TotalRate)
				   .HasColumnType("decimal(18,2)");
		}
	}
}