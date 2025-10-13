using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace happykopiAPI.Data.Migrations
{
    /// <inheritdoc />
    public partial class AdminRegisterProcedure : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            var sp_RegisterAdminForTesting = @"
            CREATE PROCEDURE dbo.sp_RegisterAdminForTesting
                @Username NVARCHAR(50),
                @PasswordHash NVARCHAR(MAX),
                @EmailAddress NVARCHAR(100),
                @PhoneNumber NVARCHAR(20),
                @FirstName NVARCHAR(50),
                @LastName NVARCHAR(50),
                @Role NVARCHAR(50) = 'Admin'
            AS
            BEGIN
                SET NOCOUNT ON;

                IF EXISTS (SELECT 1 FROM dbo.Users WHERE Username = @Username)
                    THROW 50000, 'Username already exists.', 1;

                IF EXISTS (SELECT 1 FROM dbo.Users WHERE EmailAddress = @EmailAddress)
                    THROW 50000, 'Email address already exists.', 1;

                DECLARE @FullName NVARCHAR(MAX) = @FirstName + ' ' + @LastName;

                INSERT INTO dbo.Users (Username, PasswordHash, EmailAddress, PhoneNumber, FullName, Role)
                VALUES (@Username, @PasswordHash, @EmailAddress, @PhoneNumber, @FullName, @Role);
            END";

            migrationBuilder.Sql(sp_RegisterAdminForTesting);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("DROP PROCEDURE IF EXISTS dbo.sp_RegisterAdminForTesting");
        }
    }
}
