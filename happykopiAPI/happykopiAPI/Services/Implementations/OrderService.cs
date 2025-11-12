using Dapper;
using happykopiAPI.Services.Interfaces;
using Microsoft.Data.SqlClient;
using System.Data;
using System.Text.Json;
using happykopiAPI.DTOs.Order.Outgoing_Data;
using happykopiAPI.DTOs.Order.Ingoing_Data;
using happykopiAPI.DTOs.Order.Internal;
using happykopiAPI.DTOs.Product.Outgoing_Data;
using happykopiAPI.DTOs.Modifier.Internal;
using happykopiAPI.Enums;

namespace happykopiAPI.Services.Implementations
{
    public class OrderService : IOrderService
    {
        private readonly IConfiguration _configuration;

        public OrderService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        private IDbConnection CreateConnection() => new SqlConnection(_configuration.GetConnectionString("LocalDB"));
         
        public async Task<NewOrderResponseDto> CreateOrderAsync(NewOrderRequestDto request)
        {
            using var connection = CreateConnection();

            try
            {
                // Convert request DTOs to internal JSON DTOs (camelCase for SQL Server OPENJSON)
                var orderItemsJson = request.OrderItems.Select(item => new NewOrderItemJsonDto
                {
                    productVariantId = item.ProductVariantId,
                    quantity = item.Quantity,
                    price = item.Price,
                    subtotal = item.Subtotal,
                    modifiers = item.Modifiers.Select(mod => new NewOrderModifierJsonDto
                    {
                        modifierId = mod.ModifierId,
                        quantity = mod.Quantity,
                        price = mod.Price,
                        subtotal = mod.Subtotal
                    }).ToList()
                }).ToList();

                // Serialize to JSON
                var orderItemsJsonString = JsonSerializer.Serialize(orderItemsJson, new JsonSerializerOptions
                {
                    PropertyNamingPolicy = JsonNamingPolicy.CamelCase
                });

                // Prepare parameters for stored procedure
                var parameters = new DynamicParameters();
                parameters.Add("@UserId", request.UserId);
                parameters.Add("@OrderDate", DateTime.Now);
                parameters.Add("@TotalAmount", request.TotalAmount);
                parameters.Add("@Status", request.Status);
                parameters.Add("@PaymentType", request.PaymentType);
                parameters.Add("@AmountPaid", request.AmountPaid);
                parameters.Add("@Change", request.Change);
                parameters.Add("@ReferenceNumber", request.ReferenceNumber);
                parameters.Add("@OrderItemsJson", orderItemsJsonString);
                parameters.Add("@OrderNumber", dbType: DbType.String, direction: ParameterDirection.Output, size: 40);
                parameters.Add("@OrderId", dbType: DbType.Int32, direction: ParameterDirection.Output);

                // Execute stored procedure
                await connection.ExecuteAsync(
                    "sp_InsertOrder",
                    parameters,
                    commandType: CommandType.StoredProcedure
                );

                // Get output parameters
                var orderId = parameters.Get<int>("@OrderId");
                var orderNumber = parameters.Get<string>("@OrderNumber");

                // Return response
                return new NewOrderResponseDto
                {
                    OrderId = orderId,
                    OrderNumber = orderNumber,
                    Status = "SUCCESS",
                    Message = "Order created successfully",
                    OrderDate = DateTime.Now,
                    TotalAmount = request.TotalAmount,
                    AmountPaid = request.AmountPaid,
                    Change = request.Change
                };
            }
            catch (SqlException ex)
            {
                throw new Exception($"Database error while creating order: {ex.Message}", ex);
            }
            catch (Exception ex)
            {
                throw new Exception($"Error creating order: {ex.Message}", ex);
            }
        } 

        public async Task<IEnumerable<CategoryWithProductCountDto>> GetCategoriesWithProductCountAsync()
        {
            using var connection = CreateConnection();
            return await connection.QueryAsync<CategoryWithProductCountDto>(
                "dbo.sp_GetCategoriesWithProductCount",
                commandType: CommandType.StoredProcedure);
        }

        public async Task<IEnumerable<ProductsWithCategoryDto>> GetProductsWithCategoriesAsync(int categoryId)
        {
            using var connection = CreateConnection();

            return await connection.QueryAsync<ProductsWithCategoryDto>(
                "dbo.sp_GetProductsWithCategoryOf",
                new { CategoryId = categoryId },
                commandType: CommandType.StoredProcedure
            );
        }

        public async Task<IEnumerable<ModifierCountDto>> GetModifierCountByTypeAsync()
        {
            using var connection = CreateConnection();
            var resultsFromDb = await connection.QueryAsync<ModifierCountFromDbDto>(
                "sp_GetModifierCountByType",
                commandType: CommandType.StoredProcedure
            );

            var result = resultsFromDb
                .Select(r => new ModifierCountDto
                {
                    ModifierType = ((ModifierType)r.ModifierType).ToString(),
                    ModifierCount = r.ModifierCount
                })
                .ToList();

            return result;
        }

        public async Task<IEnumerable<OrderModifierSummaryDto>> GetModifiersByTypeAsync(ModifierType modifierType)
        {
            using var connection = CreateConnection();
            var parameters = new { ModifierType = (int)modifierType };
            return await connection.QueryAsync<OrderModifierSummaryDto>("sp_GetModifiersByType", parameters, commandType: CommandType.StoredProcedure);
        }

        public async Task<IEnumerable<OrderModifierSummaryDto>> GetAllModifiersAsync()
        {
            using var connection = CreateConnection();
            return await connection.QueryAsync<OrderModifierSummaryDto>("sp_GetModifiers", commandType: CommandType.StoredProcedure);
        }

        public async Task<IEnumerable<OrderModifierSummaryDto>> GetAvailableModifiersAsync()
        {
            using var connection = CreateConnection();
            return await connection.QueryAsync<OrderModifierSummaryDto>("sp_GetAvailableModifiers", commandType: CommandType.StoredProcedure);
        }

        public async Task<ProductConfigurationResultDto> GetProductConfigurationByIdAsync(int productId)
        {
            using var connection = CreateConnection();
            var parameters = new { p_ProductId = productId };

            var multi = await connection.QueryMultipleAsync(
                "sp_GetProductConfigurationByProductId",
                parameters,
                commandType: CommandType.StoredProcedure
            );

            var variants = (await multi.ReadAsync<OrderVariantDto>()).ToList();
            Console.WriteLine($"Variants: {variants.Count}");

            var ingredients = (await multi.ReadAsync<OrderVariantIngredientDto>()).ToList();
            Console.WriteLine($"Ingredients: {ingredients.Count}");

            var addOns = (await multi.ReadAsync<OrderVarianAddontDto>())
                .Where(a => a.ModifierId != null && a.ModifierId > 0)
                .ToList();
            Console.WriteLine($"AddOns: {addOns.Count}");

            var allAvailableAddons = (await multi.ReadAsync<OrderModifierSummaryDto>()).ToList();
            Console.WriteLine($"AllAvailableAddons: {allAvailableAddons.Count}");

            return new ProductConfigurationResultDto
            {
                Variants = variants,
                Ingredients = ingredients,
                AddOns = addOns,
                AllAvailableAddons = allAvailableAddons
            };
        }
    }
}