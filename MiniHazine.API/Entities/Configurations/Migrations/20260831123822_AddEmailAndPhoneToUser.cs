using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MiniHazine.API.Migrations
{
    public partial class AddEmailAndPhoneToUser : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 8, 31, 12, 38, 22, 286, DateTimeKind.Utc).AddTicks(4123));
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 8, 31, 12, 33, 43, 873, DateTimeKind.Utc).AddTicks(33));
        }
    }
}
