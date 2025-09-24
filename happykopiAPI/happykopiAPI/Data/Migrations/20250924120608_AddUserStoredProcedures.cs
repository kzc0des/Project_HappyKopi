using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace happykopiAPI.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddUserStoredProcedures : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            var sp_UserAuthenticate = @"
            CREATE PROCEDURE sp_UserAuthenticate 
            @UserName NVARCHAR(50) 
            AS
            BEGIN
	            SET NOCOUNT ON;

	            SELECT
		        Id,
		        Username,
		        PasswordHash,
		        Role
	            FROM dbo.Users
	            WHERE Username = @Username AND IsActive = 1;
            END
            GO";

            migrationBuilder.Sql(sp_UserAuthenticate);

			var sp_UserRegister = @"
            CREATE PROCEDURE sp_UserRegister
            @Username NVARCHAR(50),
			@EmailAddress NVARCHAR(100),
			@PhoneNumber NVARCHAR(20) = NULL, 
			@PasswordHash NVARCHAR(MAX),
			@FirstName NVARCHAR(50),
			@LastName NVARCHAR(50)
			AS
			BEGIN
				SET NOCOUNT ON;
		
				IF EXISTS (SELECT 1 FROM dbo.Users WHERE Username = @Username)
					THROW 50001, 'Username already exists.', 1;			
		
				IF EXISTS (SELECT 1 FROM dbo.Users WHERE EmailAddress = @EmailAddress)
					THROW 50001, 'Email address is already registered.', 1;
		
				DECLARE @FullName NVARCHAR(MAX) = @FirstName + ' ' + @LastName;
	
				BEGIN TRANSACTION
				BEGIN TRY	
		
				INSERT INTO dbo.Users (
					Username, 
					EmailAddress, 
					PasswordHash, 
					PhoneNumber, 
					FullName
				)
				VALUES (
					@Username, 
					@EmailAddress, 
					@PasswordHash, 
					@PhoneNumber, 
					@FullName
				);
				
				COMMIT TRANSACTION
				
				END TRY
				BEGIN CATCH
				IF @@TRANCOUNT > 0
					ROLLBACK TRANSACTION
				THROW;
				END CATCH
			END";

			migrationBuilder.Sql(sp_UserRegister);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("DROP PROCEDURE IF EXISTS sp_UserAuthenticate");
            migrationBuilder.Sql("DROP PROCEDURE IF EXISTS sp_UserRegister");
        }
    }
}
