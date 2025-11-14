using Dapper;
using happykopiAPI.Services.Interfaces;
using Microsoft.Data.SqlClient;
using System.Data;
using System.Text.Json;
using happykopiAPI.DTOs.Order.Outgoing_Data;
using happykopiAPI.DTOs.Order.Ingoing_Data;
using happykopiAPI.DTOs.Order.Internal;
using happykopiAPI.DTOs.Product.Outgoing_Data;
using happykopiAPI.DTOs.Product.Internal;
using happykopiAPI.DTOs.Modifier.Internal;
using happykopiAPI.Enums;

namespace happykopiAPI.Services.Implementations
{
    public class OrderService : IOrderService
    {
        private readonly IConfiguration _configuration;
        private readonly INotificationService _notificationService;

        public OrderService(IConfiguration configuration, INotificationService notificationService)
        {
            _configuration = configuration;
            _notificationService = notificationService;
        }

        private IDbConnection CreateConnection() => new SqlConnection(_configuration.GetConnectionString("LocalDB"));

        public async Task<NewOrderResponseDto> CreateOrderAsync(NewOrderRequestDto request)
        {
            using var connection = CreateConnection();

            try
            {
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

                var orderItemsJsonString = JsonSerializer.Serialize(orderItemsJson, new JsonSerializerOptions
                {
                    PropertyNamingPolicy = JsonNamingPolicy.CamelCase
                });

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

                await connection.ExecuteAsync(
                    "sp_InsertOrder",
                    parameters,
                    commandType: CommandType.StoredProcedure
                );

                var orderId = parameters.Get<int>("@OrderId");
                var orderNumber = parameters.Get<string>("@OrderNumber");

                await _notificationService.NotifyTransactionUpdatedAsync();

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
                throw;
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

        // NEW METHOD: Get Product Availability
        public async Task<ProductAvailabilityResponseDto> GetProductAvailabilityAsync(int? categoryId = null)
        {
            using var connection = CreateConnection();

            var parameters = new { CategoryId = categoryId };

            using var multi = await connection.QueryMultipleAsync(
                "sp_CheckProductAvailability",
                parameters,
                commandType: CommandType.StoredProcedure
            );

            // Read first result set: all products with availability
            var allProducts = (await multi.ReadAsync<ProductAvailabilityFromDbDto>()).ToList();

            // Read second result set: ingredient issues
            var ingredientIssues = (await multi.ReadAsync<IngredientIssueFromDbDto>()).ToList();

            // Group ingredient issues by product
            var issuesByProduct = ingredientIssues
                .GroupBy(i => i.ProductId)
                .ToDictionary(g => g.Key, g => g.ToList());

            // Separate available and unavailable products
            var available = allProducts
                .Where(p => p.IsAvailable)
                .Select(p => new ProductWithAvailabilityDto
                {
                    ProductId = p.ProductId,
                    ProductName = p.ProductName,
                    CategoryName = p.CategoryName,
                    Price = p.Price,
                    ImageUrl = p.ImageUrl,
                    IsAvailable = true
                })
                .ToList();

            var unavailable = allProducts
                .Where(p => !p.IsAvailable)
                .Select(p =>
                {
                    var issues = issuesByProduct.ContainsKey(p.ProductId)
                        ? issuesByProduct[p.ProductId]
                        : new List<IngredientIssueFromDbDto>();

                    var reason = issues.Any() ? issues.First().Reason : "UNKNOWN";

                    return new UnavailableProductDto
                    {
                        ProductId = p.ProductId,
                        ProductName = p.ProductName,
                        CategoryName = p.CategoryName,
                        Price = p.Price,
                        ImageUrl = p.ImageUrl,
                        Reason = reason,
                        Details = issues.Select(i => new IngredientIssueDto
                        {
                            IngredientName = i.IngredientName,
                            Required = i.Required,
                            Available = i.Available,
                            UnitOfMeasure = i.UnitOfMeasure,
                            ExpiredBatchCount = i.ExpiredBatchCount,
                            TotalBatchCount = i.TotalBatchCount
                        }).ToList()
                    };
                })
                .ToList();

            return new ProductAvailabilityResponseDto
            {
                AvailableProducts = available,
                UnavailableProducts = unavailable
            };
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
            Console.WriteLine($"[DEBUG] Variants: {variants.Count}");

            // Read ingredients as dynamic to see actual column names
            var ingredientsRaw = (await multi.ReadAsync<dynamic>()).ToList();
            var ingredients = new List<OrderVariantIngredientDto>();

            foreach (var raw in ingredientsRaw)
            {
                var ing = new OrderVariantIngredientDto
                {
                    ProductVariantId = raw.ProductVariantId,
                    StockItemId = raw.StockItemId,
                    StockItemName = raw.StockItemName,
                    QuantityNeeded = raw.QuantityNeeded,
                    UnitOfMeasure = raw.UnitOfMeasure,
                    AvailableStock = raw.AvailableStock
                };

                Console.WriteLine($"[DEBUG] {ing.StockItemName}: Available={ing.AvailableStock}, Needed={ing.QuantityNeeded}");
                ingredients.Add(ing);
            }

            var addOns = (await multi.ReadAsync<OrderVarianAddontDto>())
                .Where(a => a.ModifierId != null && a.ModifierId > 0)
                .ToList();

            var allAvailableAddons = (await multi.ReadAsync<OrderModifierSummaryDto>()).ToList();

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