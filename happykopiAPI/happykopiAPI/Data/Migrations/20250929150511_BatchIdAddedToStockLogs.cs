using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace happykopiAPI.Data.Migrations
{
    /// <inheritdoc />
    public partial class BatchIdAddedToStockLogs : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_IngredientStockLogs_Ingredients_IngredientId",
                table: "IngredientStockLogs");

            migrationBuilder.AddColumn<int>(
                name: "BatchId",
                table: "IngredientStockLogs",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_IngredientStockLogs_BatchId",
                table: "IngredientStockLogs",
                column: "BatchId");

            migrationBuilder.AddForeignKey(
                name: "FK_IngredientStockLogs_IngredientBatches_BatchId",
                table: "IngredientStockLogs",
                column: "BatchId",
                principalTable: "IngredientBatches",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_IngredientStockLogs_Ingredients_IngredientId",
                table: "IngredientStockLogs",
                column: "IngredientId",
                principalTable: "Ingredients",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_IngredientStockLogs_IngredientBatches_BatchId",
                table: "IngredientStockLogs");

            migrationBuilder.DropForeignKey(
                name: "FK_IngredientStockLogs_Ingredients_IngredientId",
                table: "IngredientStockLogs");

            migrationBuilder.DropIndex(
                name: "IX_IngredientStockLogs_BatchId",
                table: "IngredientStockLogs");

            migrationBuilder.DropColumn(
                name: "BatchId",
                table: "IngredientStockLogs");

            migrationBuilder.AddForeignKey(
                name: "FK_IngredientStockLogs_Ingredients_IngredientId",
                table: "IngredientStockLogs",
                column: "IngredientId",
                principalTable: "Ingredients",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
