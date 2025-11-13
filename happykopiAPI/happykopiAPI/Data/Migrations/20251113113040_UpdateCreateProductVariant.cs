using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace happykopiAPI.Data.Migrations
{
    /// <inheritdoc />
    public partial class UpdateCreateProductVariant : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            var sql = @"
CREATE OR ALTER PROCEDURE sp_CreateProductVariant
    @ProductId INT,
    @SizeId INT,
    @Price DECIMAL(10, 2)
AS
BEGIN
    SET NOCOUNT ON;

    INSERT INTO ProductVariants (ProductId, SizeId, Price)
    VALUES (@ProductId, @SizeId, @Price);

    SELECT SCOPE_IDENTITY() AS NewProductVariantId;
END;
";             
            migrationBuilder.Sql(sql);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            var sql = @"
CREATE OR ALTER PROCEDURE sp_CreateProductVariant
    @ProductId INT,
    @SizeId NVARCHAR(5),
    @Price DECIMAL(10, 2)
AS
BEGIN
    SET NOCOUNT ON;

    INSERT INTO ProductVariants (ProductId, SizeId, Price)
    VALUES (@ProductId, @SizeId, @Price);

    SELECT SCOPE_IDENTITY() AS NewProductVariantId;
END;
";
            migrationBuilder.Sql(sql);
        }
    }
}
