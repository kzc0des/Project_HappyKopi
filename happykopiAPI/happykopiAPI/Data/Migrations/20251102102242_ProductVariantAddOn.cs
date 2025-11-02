using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace happykopiAPI.Data.Migrations
{
    /// <inheritdoc />
    public partial class ProductVariantAddOn : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ProductVariantAddOns",
                columns: table => new
                {
                    ProductVariantId = table.Column<int>(type: "int", nullable: false),
                    ModifierId = table.Column<int>(type: "int", nullable: false),
                    DefaultQuantity = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProductVariantAddOns", x => new { x.ProductVariantId, x.ModifierId });
                    table.ForeignKey(
                        name: "FK_ProductVariantAddOns_Modifiers_ModifierId",
                        column: x => x.ModifierId,
                        principalTable: "Modifiers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ProductVariantAddOns_ProductVariants_ProductVariantId",
                        column: x => x.ProductVariantId,
                        principalTable: "ProductVariants",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ProductVariantAddOns_ModifierId",
                table: "ProductVariantAddOns",
                column: "ModifierId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ProductVariantAddOns");
        }
    }
}
