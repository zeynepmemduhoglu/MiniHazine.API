using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MiniHazine.API.Migrations
{
    public partial class AddCurrencyTransactionTable : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_CurrencyTransactions_AccountId",
                table: "CurrencyTransactions",
                column: "AccountId");

            migrationBuilder.CreateIndex(
                name: "IX_CurrencyTransactions_CurrencyId",
                table: "CurrencyTransactions",
                column: "CurrencyId");

            migrationBuilder.CreateIndex(
                name: "IX_CurrencyTransactions_CustomerId",
                table: "CurrencyTransactions",
                column: "CustomerId");

            migrationBuilder.AddForeignKey(
                name: "FK_CurrencyTransactions_Accounts_AccountId",
                table: "CurrencyTransactions",
                column: "AccountId",
                principalTable: "Accounts",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_CurrencyTransactions_Currencies_CurrencyId",
                table: "CurrencyTransactions",
                column: "CurrencyId",
                principalTable: "Currencies",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_CurrencyTransactions_Customers_CustomerId",
                table: "CurrencyTransactions",
                column: "CustomerId",
                principalTable: "Customers",
                principalColumn: "Id");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_CurrencyTransactions_Accounts_AccountId",
                table: "CurrencyTransactions");

            migrationBuilder.DropForeignKey(
                name: "FK_CurrencyTransactions_Currencies_CurrencyId",
                table: "CurrencyTransactions");

            migrationBuilder.DropForeignKey(
                name: "FK_CurrencyTransactions_Customers_CustomerId",
                table: "CurrencyTransactions");

            migrationBuilder.DropIndex(
                name: "IX_CurrencyTransactions_AccountId",
                table: "CurrencyTransactions");

            migrationBuilder.DropIndex(
                name: "IX_CurrencyTransactions_CurrencyId",
                table: "CurrencyTransactions");

            migrationBuilder.DropIndex(
                name: "IX_CurrencyTransactions_CustomerId",
                table: "CurrencyTransactions");
        }
    }
}
