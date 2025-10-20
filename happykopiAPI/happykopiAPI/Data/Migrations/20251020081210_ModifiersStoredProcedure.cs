using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace happykopiAPI.Data.Migrations
{
    /// <inheritdoc />
    public partial class ModifiersStoredProcedure : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            var sp_GetModifiers = @"
            CREATE OR ALTER PROCEDURE [dbo].[sp_GetModifiers]
            AS
            BEGIN
                SET NOCOUNT ON;
                SELECT Id, Name, Price, Type, IsAvailable
                FROM dbo.Modifiers
                ORDER BY Name;
            END
            GO";

            migrationBuilder.Sql(sp_GetModifiers);

            var sp_GetAvailableModifiers = @"
            CREATE OR ALTER PROCEDURE [dbo].[sp_GetAvailableModifiers]
            AS
            BEGIN
                SET NOCOUNT ON;
                SELECT Id, Name, Price, Type, IsAvailable
                FROM dbo.Modifiers
                WHERE IsAvailable = 1
                ORDER BY Name;
            END
            GO";

            migrationBuilder.Sql(sp_GetAvailableModifiers);

            var sp_AddNewModifier = @"
            CREATE OR ALTER PROCEDURE [dbo].[sp_AddNewModifier]
                @Name NVARCHAR(100),
                @Price DECIMAL(18, 2),
                @Type NVARCHAR(50),
                @IsAvailable BIT = 1
            AS
            BEGIN
                SET XACT_ABORT ON;
                SET NOCOUNT ON;
                BEGIN TRANSACTION;
                BEGIN TRY
                    IF EXISTS (SELECT 1 FROM dbo.Modifiers WHERE Name = @Name)
                        THROW 50005, 'A modifier with this name already exists.', 1;

                    INSERT INTO dbo.Modifiers (Name, Price, Type, IsAvailable, LastUpdated)
                    VALUES (@Name, @Price, @Type, @IsAvailable, GETDATE());

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

            var sp_LinkModifierToStockItem = @"
            CREATE OR ALTER PROCEDURE [dbo].[sp_LinkModifierToStockItem]
                @ModifierId INT,
                @StockItemId INT,
                @QuantityNeeded DECIMAL(18, 2) = 1
            AS
            BEGIN
                SET NOCOUNT ON;
                SET XACT_ABORT ON;

                IF EXISTS (SELECT 1 FROM dbo.ModifierStockItems WHERE ModifierId = @ModifierId AND StockItemId = @StockItemId)
                BEGIN
                    UPDATE dbo.ModifierStockItems
                    SET QuantityNeeded = @QuantityNeeded
                    WHERE ModifierId = @ModifierId AND StockItemId = @StockItemId;
                    RETURN; 
                END

                INSERT INTO dbo.ModifierStockItems (ModifierId, StockItemId, QuantityNeeded)
                VALUES (@ModifierId, @StockItemId, @QuantityNeeded);
            END
            GO";

            migrationBuilder.Sql(sp_LinkModifierToStockItem);

            var sp_UnlinkModifierFromStockItem = @"
            CREATE OR ALTER PROCEDURE [dbo].[sp_UnlinkModifierFromStockItem]
                @ModifierId INT,
                @StockItemId INT
            AS
            BEGIN
                SET NOCOUNT ON;
                SET XACT_ABORT ON;

                IF NOT EXISTS (SELECT 1 FROM dbo.ModifierStockItems WHERE ModifierId = @ModifierId AND StockItemId = @StockItemId)
                BEGIN
                    RETURN;
                END

                DELETE FROM dbo.ModifierStockItems
                WHERE ModifierId = @ModifierId AND StockItemId = @StockItemId;
            END";

            migrationBuilder.Sql(sp_UnlinkModifierFromStockItem);

            var sp_UpdateModifierAvailability = @"
            CREATE OR ALTER PROCEDURE [dbo].[sp_UpdateModifier]
                @ModifierId INT,
                @Name NVARCHAR(100),
                @Price DECIMAL(18, 2),
                @Type NVARCHAR(50),
                @IsAvailable BIT
            AS
            BEGIN
                SET XACT_ABORT ON;
                SET NOCOUNT ON;
                BEGIN TRANSACTION;
                BEGIN TRY
                    IF NOT EXISTS (SELECT 1 FROM dbo.Modifiers WHERE Id = @ModifierId)
                        THROW 50008, 'Modifier not found.', 1;

                    IF EXISTS (SELECT 1 FROM dbo.Modifiers WHERE Name = @Name AND Id <> @ModifierId)
                        THROW 50005, 'A modifier with this name already exists.', 1;

                    UPDATE dbo.Modifiers
                    SET
                        Name = @Name,
                        Price = @Price,
                        Type = @Type,
                        IsAvailable = @IsAvailable,
                        LastUpdated = GETDATE()
                    WHERE
                        Id = @ModifierId;
                    COMMIT TRANSACTION;
                END TRY
                BEGIN CATCH
                    IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION;
                    THROW;
                END CATCH
            END";

            migrationBuilder.Sql(sp_UpdateModifierAvailability);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("DROP PROCEDURE IF EXISTS [dbo].[sp_GetModifiers]");
            migrationBuilder.Sql("DROP PROCEDURE IF EXISTS [dbo].[sp_GetAvailableModifiers]");
            migrationBuilder.Sql("DROP PROCEDURE IF EXISTS [dbo].[sp_AddNewModifier]");
            migrationBuilder.Sql("DROP PROCEDURE IF EXISTS [dbo].[sp_LinkModifierToStockItem]");
            migrationBuilder.Sql("DROP PROCEDURE IF EXISTS [dbo].[sp_UnlinkModifierFromStockItem]");
            migrationBuilder.Sql("DROP PROCEDURE IF EXISTS [dbo].[sp_UpdateModifier]");
        }
    }
}
