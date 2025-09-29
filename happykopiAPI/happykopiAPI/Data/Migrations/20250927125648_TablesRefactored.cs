using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace happykopiAPI.Data.Migrations
{
    /// <inheritdoc />
    public partial class TablesRefactored : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AddOnIngredient_AddOn_AddOnId",
                table: "AddOnIngredient");

            migrationBuilder.DropForeignKey(
                name: "FK_AddOnIngredient_Ingredients_IngredientId",
                table: "AddOnIngredient");

            migrationBuilder.DropForeignKey(
                name: "FK_OrderItemAddOn_AddOn_AddOnId",
                table: "OrderItemAddOn");

            migrationBuilder.DropForeignKey(
                name: "FK_OrderItemAddOn_OrderItems_OrderItemId",
                table: "OrderItemAddOn");

            migrationBuilder.DropPrimaryKey(
                name: "PK_OrderItemAddOn",
                table: "OrderItemAddOn");

            migrationBuilder.DropPrimaryKey(
                name: "PK_AddOnIngredient",
                table: "AddOnIngredient");

            migrationBuilder.DropPrimaryKey(
                name: "PK_AddOn",
                table: "AddOn");

            migrationBuilder.RenameTable(
                name: "OrderItemAddOn",
                newName: "OrderItemAddOns");

            migrationBuilder.RenameTable(
                name: "AddOnIngredient",
                newName: "AddOnIngredients");

            migrationBuilder.RenameTable(
                name: "AddOn",
                newName: "AddOns");

            migrationBuilder.RenameIndex(
                name: "IX_OrderItemAddOn_OrderItemId",
                table: "OrderItemAddOns",
                newName: "IX_OrderItemAddOns_OrderItemId");

            migrationBuilder.RenameIndex(
                name: "IX_OrderItemAddOn_AddOnId",
                table: "OrderItemAddOns",
                newName: "IX_OrderItemAddOns_AddOnId");

            migrationBuilder.RenameIndex(
                name: "IX_AddOnIngredient_IngredientId",
                table: "AddOnIngredients",
                newName: "IX_AddOnIngredients_IngredientId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_OrderItemAddOns",
                table: "OrderItemAddOns",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_AddOnIngredients",
                table: "AddOnIngredients",
                columns: new[] { "AddOnId", "IngredientId" });

            migrationBuilder.AddPrimaryKey(
                name: "PK_AddOns",
                table: "AddOns",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_AddOnIngredients_AddOns_AddOnId",
                table: "AddOnIngredients",
                column: "AddOnId",
                principalTable: "AddOns",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_AddOnIngredients_Ingredients_IngredientId",
                table: "AddOnIngredients",
                column: "IngredientId",
                principalTable: "Ingredients",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_OrderItemAddOns_AddOns_AddOnId",
                table: "OrderItemAddOns",
                column: "AddOnId",
                principalTable: "AddOns",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_OrderItemAddOns_OrderItems_OrderItemId",
                table: "OrderItemAddOns",
                column: "OrderItemId",
                principalTable: "OrderItems",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AddOnIngredients_AddOns_AddOnId",
                table: "AddOnIngredients");

            migrationBuilder.DropForeignKey(
                name: "FK_AddOnIngredients_Ingredients_IngredientId",
                table: "AddOnIngredients");

            migrationBuilder.DropForeignKey(
                name: "FK_OrderItemAddOns_AddOns_AddOnId",
                table: "OrderItemAddOns");

            migrationBuilder.DropForeignKey(
                name: "FK_OrderItemAddOns_OrderItems_OrderItemId",
                table: "OrderItemAddOns");

            migrationBuilder.DropPrimaryKey(
                name: "PK_OrderItemAddOns",
                table: "OrderItemAddOns");

            migrationBuilder.DropPrimaryKey(
                name: "PK_AddOns",
                table: "AddOns");

            migrationBuilder.DropPrimaryKey(
                name: "PK_AddOnIngredients",
                table: "AddOnIngredients");

            migrationBuilder.RenameTable(
                name: "OrderItemAddOns",
                newName: "OrderItemAddOn");

            migrationBuilder.RenameTable(
                name: "AddOns",
                newName: "AddOn");

            migrationBuilder.RenameTable(
                name: "AddOnIngredients",
                newName: "AddOnIngredient");

            migrationBuilder.RenameIndex(
                name: "IX_OrderItemAddOns_OrderItemId",
                table: "OrderItemAddOn",
                newName: "IX_OrderItemAddOn_OrderItemId");

            migrationBuilder.RenameIndex(
                name: "IX_OrderItemAddOns_AddOnId",
                table: "OrderItemAddOn",
                newName: "IX_OrderItemAddOn_AddOnId");

            migrationBuilder.RenameIndex(
                name: "IX_AddOnIngredients_IngredientId",
                table: "AddOnIngredient",
                newName: "IX_AddOnIngredient_IngredientId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_OrderItemAddOn",
                table: "OrderItemAddOn",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_AddOn",
                table: "AddOn",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_AddOnIngredient",
                table: "AddOnIngredient",
                columns: new[] { "AddOnId", "IngredientId" });

            migrationBuilder.AddForeignKey(
                name: "FK_AddOnIngredient_AddOn_AddOnId",
                table: "AddOnIngredient",
                column: "AddOnId",
                principalTable: "AddOn",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_AddOnIngredient_Ingredients_IngredientId",
                table: "AddOnIngredient",
                column: "IngredientId",
                principalTable: "Ingredients",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_OrderItemAddOn_AddOn_AddOnId",
                table: "OrderItemAddOn",
                column: "AddOnId",
                principalTable: "AddOn",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_OrderItemAddOn_OrderItems_OrderItemId",
                table: "OrderItemAddOn",
                column: "OrderItemId",
                principalTable: "OrderItems",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
