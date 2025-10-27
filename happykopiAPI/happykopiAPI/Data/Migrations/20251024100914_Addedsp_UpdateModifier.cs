using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace happykopiAPI.Data.Migrations
{
    /// <inheritdoc />
    public partial class Addedsp_UpdateModifier : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            //var sp_UpdateModifier = @"
            //CREATE OR ALTER PROCEDURE [dbo].[sp_UpdateModifier]
            //    @ModifierId INT,
            //    @Name NVARCHAR(100),
            //    @Price DECIMAL(18, 2),
            //    @Type NVARCHAR(50),
            //    @OzAmount DECIMAL(18, 2) = NULL,
            //    @IsAvailable BIT
            //AS
            //BEGIN
            //    SET XACT_ABORT ON;
            //    SET NOCOUNT ON;
            //    BEGIN TRANSACTION;
            //    BEGIN TRY
            //        IF EXISTS (SELECT 1 FROM dbo.Modifiers WHERE Name = @Name AND Id != @ModifierId)
            //            THROW 50005, 'A modifier with this name already exists.', 1;

            //        UPDATE dbo.Modifiers
            //        SET
            //            Name = @Name,
            //            Price = @Price,
            //            Type = @Type,
            //            OzAmount = @OzAmount,
            //            IsAvailable = @IsAvailable,
            //            LastUpdated = GETDATE()
            //        WHERE
            //            Id = @ModifierId;

            //        IF @@ROWCOUNT = 0
            //            THROW 50004, 'Modifier not found.', 1;

            //        COMMIT TRANSACTION;
            //    END TRY
            //    BEGIN CATCH
            //        IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION;
            //        THROW;
            //    END CATCH
            //END";

            //migrationBuilder.Sql(sp_UpdateModifier);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            //migrationBuilder.Sql("DROP PROCEDURE IF EXISTS [dbo].[sp_UpdateModifier]");
        }
    }
}
