using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace happykopiAPI.Data.Migrations
{
    /// <inheritdoc />
    public partial class RenameStocksToStockItems : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
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

            migrationBuilder.DropPrimaryKey(
                name: "PK_Stocks",
                table: "Stocks");

            migrationBuilder.RenameTable(
                name: "Stocks",
                newName: "StockItems");

            migrationBuilder.AddPrimaryKey(
                name: "PK_StockItems",
                table: "StockItems",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_AddOnIngredients_StockItems_IngredientId",
                table: "AddOnIngredients",
                column: "IngredientId",
                principalTable: "StockItems",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_DailyIngredientSummaries_StockItems_IngredientId",
                table: "DailyIngredientSummaries",
                column: "IngredientId",
                principalTable: "StockItems",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_IngredientBatches_StockItems_IngredientId",
                table: "IngredientBatches",
                column: "IngredientId",
                principalTable: "StockItems",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_IngredientStockLogs_StockItems_IngredientId",
                table: "IngredientStockLogs",
                column: "IngredientId",
                principalTable: "StockItems",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_ProductIngredients_StockItems_IngredientId",
                table: "ProductIngredients",
                column: "IngredientId",
                principalTable: "StockItems",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AddOnIngredients_StockItems_IngredientId",
                table: "AddOnIngredients");

            migrationBuilder.DropForeignKey(
                name: "FK_DailyIngredientSummaries_StockItems_IngredientId",
                table: "DailyIngredientSummaries");

            migrationBuilder.DropForeignKey(
                name: "FK_IngredientBatches_StockItems_IngredientId",
                table: "IngredientBatches");

            migrationBuilder.DropForeignKey(
                name: "FK_IngredientStockLogs_StockItems_IngredientId",
                table: "IngredientStockLogs");

            migrationBuilder.DropForeignKey(
                name: "FK_ProductIngredients_StockItems_IngredientId",
                table: "ProductIngredients");

            migrationBuilder.DropPrimaryKey(
                name: "PK_StockItems",
                table: "StockItems");

            migrationBuilder.RenameTable(
                name: "StockItems",
                newName: "Stocks");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Stocks",
                table: "Stocks",
                column: "Id");

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
    }
}
