using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MiniHazine.API.Migrations
{
    public partial class AddAdminUser : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 8, 31, 11, 22, 47, 179, DateTimeKind.Utc).AddTicks(4115));
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 8, 31, 8, 22, 41, 964, DateTimeKind.Utc).AddTicks(7848));
        }
    }
}
