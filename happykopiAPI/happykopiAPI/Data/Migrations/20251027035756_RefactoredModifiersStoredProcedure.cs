using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace happykopiAPI.Data.Migrations
{
    /// <inheritdoc />
    public partial class RefactoredModifiersStoredProcedure : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            var sp_AddNewModifiers = @"
            CREATE OR ALTER   PROCEDURE [dbo].[sp_AddNewModifier]
                @Name NVARCHAR(100),
                @Price DECIMAL(18, 2),
                @Type NVARCHAR(50),
                @OzAmount DECIMAL(18, 2) = NULL,
                @IsAvailable BIT,
                @IsActive BIT
            AS
            BEGIN
                SET XACT_ABORT ON;
                SET NOCOUNT ON;
                BEGIN TRANSACTION;
                BEGIN TRY
                    IF EXISTS (SELECT 1 FROM dbo.Modifiers WHERE Name = @Name)
                        THROW 50005, 'A modifier with this name already exists.', 1;

                    INSERT INTO dbo.Modifiers (Name, Price, Type, OzAmount, IsAvailable, IsActive)
                    VALUES (@Name, @Price, @Type, @OzAmount, @IsAvailable, @IsActive);

                    DECLARE @NewModifierId INT = SCOPE_IDENTITY();
                    COMMIT TRANSACTION;
                    SELECT @NewModifierId AS NewModifierId;
                END TRY
                BEGIN CATCH
                    IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION;
                    THROW;
                END CATCH
            END";

            migrationBuilder.Sql(sp_AddNewModifiers);

            var sp_UpdateModifier = @"
            CREATE OR ALTER   PROCEDURE [dbo].[sp_UpdateModifier]
                @ModifierId INT,
                @Name NVARCHAR(100),
                @Price DECIMAL(18, 2),
                @Type NVARCHAR(50),
                @OzAmount DECIMAL(18, 2) = NULL,
                @IsAvailable BIT
            AS
            BEGIN
                SET XACT_ABORT ON;
                BEGIN TRANSACTION;
                BEGIN TRY
                    IF EXISTS (SELECT 1 FROM dbo.Modifiers WHERE Name = @Name AND Id != @ModifierId)
                        THROW 50005, 'A modifier with this name already exists.', 1;

                    UPDATE dbo.Modifiers
                    SET
                        Name = @Name,
                        Price = @Price,
                        Type = @Type,
                        OzAmount = @OzAmount,
                        IsAvailable = @IsAvailable
                    WHERE
                        Id = @ModifierId;

                    IF @@ROWCOUNT = 0
                        THROW 50004, 'Modifier not found.', 1;

                    COMMIT TRANSACTION;
                END TRY
                BEGIN CATCH
                    IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION;
                    THROW;
                END CATCH
            END";

            migrationBuilder.Sql(sp_UpdateModifier);

            var sp_GetModifierById = @"
            CREATE OR ALTER   PROCEDURE [dbo].[sp_GetModifierById]
                @ModifierId INT
            AS
            BEGIN
                SET NOCOUNT ON;

                SELECT
                    m.Id,
                    m.Name,
                    m.Price,
                    m.OzAmount,
                    m.Type,
                    m.IsAvailable,
                    (
                        SELECT
                            msi.StockItemId,
                            si.Name AS StockItemName,
                            msi.QuantityNeeded
                        FROM
                            dbo.ModifierStockItems AS msi
                        JOIN
                            dbo.StockItems AS si ON msi.StockItemId = si.Id
                        WHERE
                            msi.ModifierId = m.Id
                        FOR JSON PATH
                    ) AS LinkedItems
                FROM
                    dbo.Modifiers AS m
                WHERE
                    m.Id = @ModifierId
                FOR JSON PATH, WITHOUT_ARRAY_WRAPPER;
            END";

            migrationBuilder.Sql(sp_GetModifierById);

            var sp_DeleteModifier = @"
            CREATE OR ALTER PROCEDURE [dbo].[sp_DeleteModifier]
                @ModifierId INT
            AS
            BEGIN
                SET NOCOUNT ON;
                SET XACT_ABORT ON;

                BEGIN TRANSACTION;

                BEGIN TRY
                    IF NOT EXISTS (SELECT 1 FROM dbo.Modifiers WHERE Id = @ModifierId AND IsActive = 1)
                        THROW 50006, 'Modifier not found or is already inactive.', 1;

                    UPDATE dbo.Modifiers
                    SET IsActive = 0
                    WHERE Id = @ModifierId;

                    COMMIT TRANSACTION;

                END TRY
                BEGIN CATCH
                    IF @@TRANCOUNT > 0
                        ROLLBACK TRANSACTION;
                    THROW;
                END CATCH
            END";

            migrationBuilder.Sql(sp_DeleteModifier);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("DROP PROCEDURE IF EXISTS [dbo].[sp_AddNewModifier]");
            migrationBuilder.Sql("DROP PROCEDURE IF EXISTS [dbo].[sp_UpdateModifier]");
            migrationBuilder.Sql("DROP PROCEDURE IF EXISTS [dbo].[sp_GetModifierById]");
            migrationBuilder.Sql("DROP PROCEDURE IF EXISTS [dbo].[sp_DeleteModifier]");
        }
    }
}
