using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace happykopiAPI.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddedOrderStoredProcedures : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            var sp_GetAllAvailableAndActiveProducts = @"
            CREATE OR ALTER PROCEDURE sp_GetAllAvailableAndActiveProducts
            @CategoryId INT = NULL
            AS
            BEGIN
                SET NOCOUNT ON;

                SELECT 
                    p.Id,
                    p.Name,
                    p.ImageUrl,
                    p.IsAvailable,
                    p.CategoryId,
                    c.Name AS CategoryName
                FROM Products p
                JOIN Categories c ON c.Id = p.CategoryId
                WHERE 
                p.IsActive = 1
                AND (@CategoryId IS NULL OR p.CategoryId = @CategoryId);
            END";

            migrationBuilder.Sql(sp_GetAllAvailableAndActiveProducts);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("DROP PROCEDURE IF EXISTS sp_GetAllAvailableAndActiveProducts");
        }
    }
}
