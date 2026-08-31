using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MiniHazine.API.Migrations
{
    public partial class AddUserPreferencesAndColumns : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "NotificationsEnabled" },
                values: new object[] { new DateTime(2026, 8, 31, 8, 22, 41, 964, DateTimeKind.Utc).AddTicks(7848), false });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "NotificationsEnabled" },
                values: new object[] { new DateTime(2026, 8, 31, 8, 3, 26, 197, DateTimeKind.Utc).AddTicks(6723), true });
        }
    }
}
