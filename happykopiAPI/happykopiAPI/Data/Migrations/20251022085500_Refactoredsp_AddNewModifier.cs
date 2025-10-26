using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace happykopiAPI.Data.Migrations
{
    /// <inheritdoc />
    public partial class Refactoredsp_AddNewModifier : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            var sp_AddNewModifier = @"
            CREATE OR ALTER PROCEDURE [dbo].[sp_AddNewModifier]
                @Name NVARCHAR(100),
                @Price DECIMAL(18, 2),
                @Type NVARCHAR(50),
                @OzAmount DECIMAL(18, 2) = NULL,
                @IsAvailable BIT = 1
            AS
            BEGIN
                SET XACT_ABORT ON;
                SET NOCOUNT ON;
                BEGIN TRANSACTION;
                BEGIN TRY
                    IF EXISTS (SELECT 1 FROM dbo.Modifiers WHERE Name = @Name)
                        THROW 50005, 'A modifier with this name already exists.', 1;

                    INSERT INTO dbo.Modifiers (Name, Price, Type, OzAmount, IsAvailable, LastUpdated)
                    VALUES (@Name, @Price, @Type, @OzAmount, @IsAvailable, GETDATE());

                    DECLARE @NewModifierId INT = SCOPE_IDENTITY();
                    COMMIT TRANSACTION;
                    SELECT @NewModifierId AS NewModifierId;
                END TRY
                BEGIN CATCH
                    IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION;
                    THROW;
                END CATCH
            END";

            migrationBuilder.Sql(sp_AddNewModifier);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("DROP PROCEDURE IF EXISTS [dbo].[sp_AddNewModifier]");
        }
    }
}
