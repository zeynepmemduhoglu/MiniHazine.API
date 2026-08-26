using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MiniHazine.API.Migrations
{
    public partial class MusteriRaporuEklendi : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "AccountId1",
                table: "CurrencyTransactions",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_CurrencyTransactions_AccountId1",
                table: "CurrencyTransactions",
                column: "AccountId1");

            migrationBuilder.AddForeignKey(
                name: "FK_CurrencyTransactions_Accounts_AccountId1",
                table: "CurrencyTransactions",
                column: "AccountId1",
                principalTable: "Accounts",
                principalColumn: "Id");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_CurrencyTransactions_Accounts_AccountId1",
                table: "CurrencyTransactions");

            migrationBuilder.DropIndex(
                name: "IX_CurrencyTransactions_AccountId1",
                table: "CurrencyTransactions");

            migrationBuilder.DropColumn(
                name: "AccountId1",
                table: "CurrencyTransactions");
        }
    }
}
