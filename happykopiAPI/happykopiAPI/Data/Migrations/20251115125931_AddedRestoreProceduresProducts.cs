using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace happykopiAPI.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddedRestoreProceduresProducts : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            var spGetInactiveProductsSql = @"
        CREATE OR ALTER PROCEDURE [dbo].[sp_GetInactiveProducts]
            @CategoryId INT = NULL
        AS
        BEGIN
            SET NOCOUNT ON;
            SELECT
                p.Id,
                p.Name,
                c.Name AS CategoryName,
                p.ImageUrl,
                p.IsActive
            FROM
                dbo.Products p
            JOIN
                dbo.Categories c ON p.CategoryId = c.Id
        all     WHERE
                p.IsActive = 0
                AND (@CategoryId IS NULL OR p.CategoryId = @CategoryId);
        END
        ";

            var spRestoreProductSql = @"
        CREATE OR ALTER PROCEDURE [dbo].[sp_RestoreProduct]
            @ProductId INT
        AS
        BEGIN
            UPDATE dbo.Products
            SET IsActive = 1
            WHERE Id = @ProductId;
        END
        ";

            migrationBuilder.Sql(spGetInactiveProductsSql);
            migrationBuilder.Sql(spRestoreProductSql);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("DROP PROCEDURE IF EXISTS [dbo].[sp_GetInactiveProducts]");
            migrationBuilder.Sql("DROP PROCEDURE IF EXISTS [dbo].[sp_RestoreProduct]");
        }
    }
}
