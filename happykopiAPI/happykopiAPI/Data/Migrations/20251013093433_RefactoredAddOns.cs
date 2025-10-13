using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace happykopiAPI.Data.Migrations
{
    /// <inheritdoc />
    public partial class RefactoredAddOns : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AddOnIngredients");

            migrationBuilder.DropColumn(
                name: "AlertLevel",
                table: "AddOns");

            migrationBuilder.DropColumn(
                name: "ExpiryDate",
                table: "AddOns");

            migrationBuilder.DropColumn(
                name: "NeedsIngredientBreakdown",
                table: "AddOns");

            migrationBuilder.DropColumn(
                name: "StockQuantity",
                table: "AddOns");

            migrationBuilder.DropColumn(
                name: "UnitOfMeasure",
                table: "AddOns");

            migrationBuilder.AddColumn<bool>(
                name: "IsAvailable",
                table: "AddOns",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsAvailable",
                table: "AddOns");

            migrationBuilder.AddColumn<decimal>(
                name: "AlertLevel",
                table: "AddOns",
                type: "decimal(18,2)",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "ExpiryDate",
                table: "AddOns",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "NeedsIngredientBreakdown",
                table: "AddOns",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<decimal>(
                name: "StockQuantity",
                table: "AddOns",
                type: "decimal(18,2)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "UnitOfMeasure",
                table: "AddOns",
                type: "nvarchar(20)",
                maxLength: 20,
                nullable: true);

            migrationBuilder.CreateTable(
                name: "AddOnIngredients",
                columns: table => new
                {
                    AddOnId = table.Column<int>(type: "int", nullable: false),
                    IngredientId = table.Column<int>(type: "int", nullable: false),
                    QuantityNeeded = table.Column<decimal>(type: "decimal(18,2)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AddOnIngredients", x => new { x.AddOnId, x.IngredientId });
                    table.ForeignKey(
                        name: "FK_AddOnIngredients_AddOns_AddOnId",
                        column: x => x.AddOnId,
                        principalTable: "AddOns",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_AddOnIngredients_StockItems_IngredientId",
                        column: x => x.IngredientId,
                        principalTable: "StockItems",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_AddOnIngredients_IngredientId",
                table: "AddOnIngredients",
                column: "IngredientId");
        }
    }
}
