using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DeliveryAPI.Data.Migrations
{
    public partial class RestOwnerField : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Owner",
                table: "Restaurants",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Owner",
                table: "Restaurants");
        }
    }
}
