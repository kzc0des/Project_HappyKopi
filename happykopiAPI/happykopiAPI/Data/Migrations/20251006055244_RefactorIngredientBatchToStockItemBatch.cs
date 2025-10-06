using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace happykopiAPI.Data.Migrations
{
    /// <inheritdoc />
    public partial class RefactorIngredientBatchToStockItemBatch : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ProductIngredients_StockItems_IngredientId",
                table: "ProductIngredients");

            migrationBuilder.DropTable(
                name: "IngredientStockLogs");

            migrationBuilder.DropTable(
                name: "IngredientBatches");

            migrationBuilder.RenameColumn(
                name: "IngredientId",
                table: "ProductIngredients",
                newName: "StockItemId");

            migrationBuilder.RenameIndex(
                name: "IX_ProductIngredients_IngredientId",
                table: "ProductIngredients",
                newName: "IX_ProductIngredients_StockItemId");

            migrationBuilder.CreateTable(
                name: "StockItemBatches",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    StockItemId = table.Column<int>(type: "int", nullable: false),
                    StockQuantity = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    DateReceived = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETUTCDATE()"),
                    ExpiryDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    DateUsed = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_StockItemBatches", x => x.Id);
                    table.ForeignKey(
                        name: "FK_StockItemBatches_StockItems_StockItemId",
                        column: x => x.StockItemId,
                        principalTable: "StockItems",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "StockLogs",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    StockItemId = table.Column<int>(type: "int", nullable: false),
                    BatchId = table.Column<int>(type: "int", nullable: false),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    ChangeType = table.Column<int>(type: "int", nullable: false),
                    QuantityChanged = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    StockQuantityBefore = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    StockQuantityAfter = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Remarks = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    DateLogged = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETUTCDATE()"),
                    IngredientId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_StockLogs", x => x.Id);
                    table.ForeignKey(
                        name: "FK_StockLogs_StockItemBatches_BatchId",
                        column: x => x.BatchId,
                        principalTable: "StockItemBatches",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_StockLogs_StockItems_StockItemId",
                        column: x => x.StockItemId,
                        principalTable: "StockItems",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_StockLogs_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_StockItemBatches_StockItemId",
                table: "StockItemBatches",
                column: "StockItemId");

            migrationBuilder.CreateIndex(
                name: "IX_StockLogs_BatchId",
                table: "StockLogs",
                column: "BatchId");

            migrationBuilder.CreateIndex(
                name: "IX_StockLogs_StockItemId",
                table: "StockLogs",
                column: "StockItemId");

            migrationBuilder.CreateIndex(
                name: "IX_StockLogs_UserId",
                table: "StockLogs",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_ProductIngredients_StockItems_StockItemId",
                table: "ProductIngredients",
                column: "StockItemId",
                principalTable: "StockItems",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ProductIngredients_StockItems_StockItemId",
                table: "ProductIngredients");

            migrationBuilder.DropTable(
                name: "StockLogs");

            migrationBuilder.DropTable(
                name: "StockItemBatches");

            migrationBuilder.RenameColumn(
                name: "StockItemId",
                table: "ProductIngredients",
                newName: "IngredientId");

            migrationBuilder.RenameIndex(
                name: "IX_ProductIngredients_StockItemId",
                table: "ProductIngredients",
                newName: "IX_ProductIngredients_IngredientId");

            migrationBuilder.CreateTable(
                name: "IngredientBatches",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    IngredientId = table.Column<int>(type: "int", nullable: false),
                    DateReceived = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETUTCDATE()"),
                    DateUsed = table.Column<DateTime>(type: "datetime2", nullable: true),
                    ExpiryDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    StockQuantity = table.Column<decimal>(type: "decimal(18,2)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_IngredientBatches", x => x.Id);
                    table.ForeignKey(
                        name: "FK_IngredientBatches_StockItems_IngredientId",
                        column: x => x.IngredientId,
                        principalTable: "StockItems",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "IngredientStockLogs",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    BatchId = table.Column<int>(type: "int", nullable: false),
                    IngredientId = table.Column<int>(type: "int", nullable: false),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    ChangeType = table.Column<int>(type: "int", nullable: false),
                    DateLogged = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETUTCDATE()"),
                    QuantityChanged = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Remarks = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    StockQuantityAfter = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    StockQuantityBefore = table.Column<decimal>(type: "decimal(18,2)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_IngredientStockLogs", x => x.Id);
                    table.ForeignKey(
                        name: "FK_IngredientStockLogs_IngredientBatches_BatchId",
                        column: x => x.BatchId,
                        principalTable: "IngredientBatches",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_IngredientStockLogs_StockItems_IngredientId",
                        column: x => x.IngredientId,
                        principalTable: "StockItems",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_IngredientStockLogs_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_IngredientBatches_IngredientId",
                table: "IngredientBatches",
                column: "IngredientId");

            migrationBuilder.CreateIndex(
                name: "IX_IngredientStockLogs_BatchId",
                table: "IngredientStockLogs",
                column: "BatchId");

            migrationBuilder.CreateIndex(
                name: "IX_IngredientStockLogs_IngredientId",
                table: "IngredientStockLogs",
                column: "IngredientId");

            migrationBuilder.CreateIndex(
                name: "IX_IngredientStockLogs_UserId",
                table: "IngredientStockLogs",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_ProductIngredients_StockItems_IngredientId",
                table: "ProductIngredients",
                column: "IngredientId",
                principalTable: "StockItems",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
