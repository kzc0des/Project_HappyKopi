using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace happykopiAPI.Data.Migrations
{
    /// <inheritdoc />
    public partial class RefactorIngredientToStockItem : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AddOnIngredients_Ingredients_IngredientId",
                table: "AddOnIngredients");

            migrationBuilder.DropForeignKey(
                name: "FK_DailyIngredientSummaries_Ingredients_IngredientId",
                table: "DailyIngredientSummaries");

            migrationBuilder.DropForeignKey(
                name: "FK_IngredientBatches_Ingredients_IngredientId",
                table: "IngredientBatches");

            migrationBuilder.DropForeignKey(
                name: "FK_IngredientStockLogs_Ingredients_IngredientId",
                table: "IngredientStockLogs");

            migrationBuilder.DropForeignKey(
                name: "FK_ProductIngredients_Ingredients_IngredientId",
                table: "ProductIngredients");

            migrationBuilder.DropTable(
                name: "Ingredients");

            migrationBuilder.CreateTable(
                name: "Stocks",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    UnitOfMeasure = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    AlertLevel = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    LastUpdated = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETUTCDATE()"),
                    IsPerishable = table.Column<bool>(type: "bit", nullable: false, defaultValue: false),
                    ItemType = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Stocks", x => x.Id);
                });

            migrationBuilder.AddForeignKey(
                name: "FK_AddOnIngredients_Stocks_IngredientId",
                table: "AddOnIngredients",
                column: "IngredientId",
                principalTable: "Stocks",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_DailyIngredientSummaries_Stocks_IngredientId",
                table: "DailyIngredientSummaries",
                column: "IngredientId",
                principalTable: "Stocks",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_IngredientBatches_Stocks_IngredientId",
                table: "IngredientBatches",
                column: "IngredientId",
                principalTable: "Stocks",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_IngredientStockLogs_Stocks_IngredientId",
                table: "IngredientStockLogs",
                column: "IngredientId",
                principalTable: "Stocks",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_ProductIngredients_Stocks_IngredientId",
                table: "ProductIngredients",
                column: "IngredientId",
                principalTable: "Stocks",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AddOnIngredients_Stocks_IngredientId",
                table: "AddOnIngredients");

            migrationBuilder.DropForeignKey(
                name: "FK_DailyIngredientSummaries_Stocks_IngredientId",
                table: "DailyIngredientSummaries");

            migrationBuilder.DropForeignKey(
                name: "FK_IngredientBatches_Stocks_IngredientId",
                table: "IngredientBatches");

            migrationBuilder.DropForeignKey(
                name: "FK_IngredientStockLogs_Stocks_IngredientId",
                table: "IngredientStockLogs");

            migrationBuilder.DropForeignKey(
                name: "FK_ProductIngredients_Stocks_IngredientId",
                table: "ProductIngredients");

            migrationBuilder.DropTable(
                name: "Stocks");

            migrationBuilder.CreateTable(
                name: "Ingredients",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    AlertLevel = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    IsPerishable = table.Column<bool>(type: "bit", nullable: false, defaultValue: false),
                    LastUpdated = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETUTCDATE()"),
                    Name = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    UnitOfMeasure = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Ingredients", x => x.Id);
                });

            migrationBuilder.AddForeignKey(
                name: "FK_AddOnIngredients_Ingredients_IngredientId",
                table: "AddOnIngredients",
                column: "IngredientId",
                principalTable: "Ingredients",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_DailyIngredientSummaries_Ingredients_IngredientId",
                table: "DailyIngredientSummaries",
                column: "IngredientId",
                principalTable: "Ingredients",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_IngredientBatches_Ingredients_IngredientId",
                table: "IngredientBatches",
                column: "IngredientId",
                principalTable: "Ingredients",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_IngredientStockLogs_Ingredients_IngredientId",
                table: "IngredientStockLogs",
                column: "IngredientId",
                principalTable: "Ingredients",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_ProductIngredients_Ingredients_IngredientId",
                table: "ProductIngredients",
                column: "IngredientId",
                principalTable: "Ingredients",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
