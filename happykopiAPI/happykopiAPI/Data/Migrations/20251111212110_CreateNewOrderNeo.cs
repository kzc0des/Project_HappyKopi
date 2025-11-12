using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace happykopiAPI.Data.Migrations
{
    /// <inheritdoc />
    public partial class CreateNewOrderNeo : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Drop existing version if any (safety)
            migrationBuilder.Sql(@"
                DROP PROCEDURE IF EXISTS [dbo].[CreateNewOrder];
GO
            ");

            // Create or alter the new stored procedure
            var createSpSql = @"
                CREATE OR ALTER PROCEDURE [dbo].[CreateNewOrder]
                    @UserId INT,
                    @OrderNumber NVARCHAR(50),
                    @TotalAmount DECIMAL(18, 2),
                    @TransactionDate DATETIME2(0),
                    @Status NVARCHAR(50),

                    @PaymentType NVARCHAR(50),
                    @AmountPaid DECIMAL(18, 2),
                    @Change DECIMAL(18, 2),
                    @ReferenceNumber NVARCHAR(100),

                    @NewOrderId INT OUTPUT
                AS
                BEGIN
                    SET NOCOUNT ON;
                    SET XACT_ABORT ON;

                    BEGIN TRANSACTION;

                    BEGIN TRY
                        ---------------------------------------------------------
                        -- 1. Insert into Orders table
                        ---------------------------------------------------------
                        INSERT INTO dbo.Orders (
                            OrderNumber,
                            UserId,
                            OrderDate,
                            TotalAmount,
                            Status
                        )
                        VALUES (
                            @OrderNumber,
                            @UserId,
                            @TransactionDate,
                            @TotalAmount,
                            @Status
                        );

                        -- Get the newly generated OrderId
                        SET @NewOrderId = SCOPE_IDENTITY();

                        ---------------------------------------------------------
                        -- 2. Insert into Transactions table
                        ---------------------------------------------------------
                        INSERT INTO dbo.Transactions (
                            OrderId,
                            PaymentType,
                            AmountPaid,
                            [Change],
                            TransactionDate,
                            ReferenceNumber
                        )
                        VALUES (
                            @NewOrderId,
                            @PaymentType,
                            @AmountPaid,
                            @Change,
                            @TransactionDate,
                            @ReferenceNumber
                        );

                        ---------------------------------------------------------
                        -- 3. Commit Transaction
                        ---------------------------------------------------------
                        COMMIT TRANSACTION;
                    END TRY
                    BEGIN CATCH
                        IF @@TRANCOUNT > 0
                            ROLLBACK TRANSACTION;

                        -- Rethrow the error for EF to handle
                        THROW;
                    END CATCH
                END;
GO";

            migrationBuilder.Sql(createSpSql);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("DROP PROCEDURE IF EXISTS [dbo].[CreateNewOrder];");

        }
    }
}
