using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace happykopiAPI.Data.Migrations
{
    /// <inheritdoc />
    public partial class RefactoredOrderItemTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_OrderItems_Products_ProductId",
                table: "OrderItems");

            migrationBuilder.DropForeignKey(
                name: "FK_StockLogs_StockItemBatches_BatchId",
                table: "StockLogs");

            migrationBuilder.RenameColumn(
                name: "BatchId",
                table: "StockLogs",
                newName: "StockItemBatchId");

            migrationBuilder.RenameIndex(
                name: "IX_StockLogs_BatchId",
                table: "StockLogs",
                newName: "IX_StockLogs_StockItemBatchId");

            migrationBuilder.RenameColumn(
                name: "ProductId",
                table: "OrderItems",
                newName: "ProductVariantId");

            migrationBuilder.RenameIndex(
                name: "IX_OrderItems_ProductId",
                table: "OrderItems",
                newName: "IX_OrderItems_ProductVariantId");

            migrationBuilder.AddForeignKey(
                name: "FK_OrderItems_ProductVariants_ProductVariantId",
                table: "OrderItems",
                column: "ProductVariantId",
                principalTable: "ProductVariants",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_StockLogs_StockItemBatches_StockItemBatchId",
                table: "StockLogs",
                column: "StockItemBatchId",
                principalTable: "StockItemBatches",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_OrderItems_ProductVariants_ProductVariantId",
                table: "OrderItems");

            migrationBuilder.DropForeignKey(
                name: "FK_StockLogs_StockItemBatches_StockItemBatchId",
                table: "StockLogs");

            migrationBuilder.RenameColumn(
                name: "StockItemBatchId",
                table: "StockLogs",
                newName: "BatchId");

            migrationBuilder.RenameIndex(
                name: "IX_StockLogs_StockItemBatchId",
                table: "StockLogs",
                newName: "IX_StockLogs_BatchId");

            migrationBuilder.RenameColumn(
                name: "ProductVariantId",
                table: "OrderItems",
                newName: "ProductId");

            migrationBuilder.RenameIndex(
                name: "IX_OrderItems_ProductVariantId",
                table: "OrderItems",
                newName: "IX_OrderItems_ProductId");

            migrationBuilder.AddForeignKey(
                name: "FK_OrderItems_Products_ProductId",
                table: "OrderItems",
                column: "ProductId",
                principalTable: "Products",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_StockLogs_StockItemBatches_BatchId",
                table: "StockLogs",
                column: "BatchId",
                principalTable: "StockItemBatches",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
