using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ecommerce.Migrations
{
    /// <inheritdoc />
    public partial class wishlistfix : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_WishList_ProductId",
                table: "WishList",
                column: "ProductId");

            migrationBuilder.AddForeignKey(
                name: "FK_WishList_Products_ProductId",
                table: "WishList",
                column: "ProductId",
                principalTable: "Products",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_WishList_Products_ProductId",
                table: "WishList");

            migrationBuilder.DropIndex(
                name: "IX_WishList_ProductId",
                table: "WishList");
        }
    }
}
