using happykopiAPI.Enums;
using happykopiAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace happykopiAPI.Data
{
    public class HappyKopiDbContext : DbContext
    {
        public HappyKopiDbContext(DbContextOptions<HappyKopiDbContext> options) : base(options)
        {
        }
        public DbSet<User> Users { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<Ingredient> Ingredients { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderItem> OrderItems { get; set; }
        public DbSet<Transaction> Transactions { get; set; }
        public DbSet<ProductIngredient> ProductIngredients { get; set; }
        public DbSet<IngredientStockLog> IngredientStockLogs { get; set; }
        public DbSet<DailyIngredientSummary> DailyIngredientSummaries { get; set; }
        public DbSet<IngredientBatch> IngredientBatches { get; set; }
        public DbSet<AddOn> AddOns { get; set; }
        public DbSet<AddOnIngredient> AddOnIngredients { get; set; }
        public DbSet<OrderItemAddOn> OrderItemAddOns { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<ProductIngredient>()
                .HasKey(pi => new { pi.ProductId, pi.IngredientId });

            modelBuilder.Entity<ProductIngredient>()
                .HasOne(pi => pi.Product)
                .WithMany(p => p.Recipe)
                .HasForeignKey(pi => pi.ProductId);

            modelBuilder.Entity<ProductIngredient>()
                .HasOne(pi => pi.Ingredient)
                .WithMany(i => i.Recipe)
                .HasForeignKey(pi => pi.IngredientId);

            modelBuilder.Entity<Order>()
                .HasMany(o => o.OrderItems)
                .WithOne(oi => oi.Order)
                .HasForeignKey(oi => oi.OrderId);

            modelBuilder.Entity<Order>()
                .HasOne(o => o.Transaction)
                .WithOne(t => t.Order)
                .HasForeignKey<Transaction>(t => t.OrderId);
                
            modelBuilder.Entity<Category>()
                .HasMany(c => c.Products)
                .WithOne(p => p.Category)
                .HasForeignKey(p => p.CategoryId);

            modelBuilder.Entity<User>()
                .Property(u => u.Role)
                .HasConversion<string>();

            modelBuilder.Entity<Order>()
                .Property(o => o.Status)
                .HasConversion<string>();

            modelBuilder.Entity<Transaction>()
                .Property(t => t.PaymentType)
                .HasConversion<string>();

            modelBuilder.Entity<User>()
                .Property(u => u.Role)
                .HasDefaultValue(UserRole.Barista);

            modelBuilder.Entity<User>()
                .Property(u => u.IsActive)
                .HasDefaultValue(true);

            modelBuilder.Entity<User>()
                .Property(u => u.DateCreated)
                .HasDefaultValueSql("GETUTCDATE()");

            modelBuilder.Entity<Order>()
                .Property(o => o.OrderDate)
                .HasDefaultValueSql("GETUTCDATE()");

            modelBuilder.Entity<IngredientStockLog>()
                .Property(log => log.DateLogged)
                .HasDefaultValueSql("GETUTCDATE()");

            modelBuilder.Entity<Transaction>()
                .Property(t => t.TransactionDate)
                .HasDefaultValueSql("GETUTCDATE()");

            modelBuilder.Entity<Product>()
                .Property(p => p.IsAvailable)
                .HasDefaultValue(true);

            modelBuilder.Entity<User>()
                .HasIndex(u => u.Username)
                .IsUnique();

            modelBuilder.Entity<Order>()
                .HasIndex(o => o.OrderNumber)
                .IsUnique();

            modelBuilder.Entity<Ingredient>()
                .HasMany(i => i.Batches)
                .WithOne(b => b.Ingredient)
                .HasForeignKey(b => b.IngredientId);

            modelBuilder.Entity<Ingredient>()
                .HasMany(i => i.StockLogs)
                .WithOne(log => log.Ingredient)
                .HasForeignKey(log => log.IngredientId);

            modelBuilder.Entity<Ingredient>()
                .Property(i => i.IsPerishable)
                .HasDefaultValue(false);

            modelBuilder.Entity<IngredientBatch>()
                .Property(b => b.DateReceived)
                .HasDefaultValueSql("GETUTCDATE()");

            modelBuilder.Entity<Ingredient>()
                .Property(i => i.LastUpdated)
                .HasDefaultValueSql("GETUTCDATE()");

            modelBuilder.Entity<AddOn>()
                .Property(a => a.NeedsIngredientBreakdown)
                .HasDefaultValue(false);

            modelBuilder.Entity<AddOn>()
                .Property(a => a.StockQuantity)
                .HasColumnType("decimal(18,2)");

            modelBuilder.Entity<AddOn>()
                .Property(a => a.LastUpdated)
                .IsRequired()
                .HasDefaultValueSql("GETUTCDATE()");

            modelBuilder.Entity<AddOnIngredient>()
                .HasKey(ai => new { ai.AddOnId, ai.IngredientId });

            modelBuilder.Entity<AddOnIngredient>()
                .HasOne(ai => ai.AddOn)
                .WithMany(a => a.Ingredients)
                .HasForeignKey(ai => ai.AddOnId);

            modelBuilder.Entity<AddOnIngredient>()
                .HasOne(ai => ai.Ingredient)
                .WithMany(i => i.AddOnRecipes)
                .HasForeignKey(ai => ai.IngredientId);

            modelBuilder.Entity<OrderItemAddOn>()
                .HasOne(oia => oia.OrderItem)
                .WithMany(oi => oi.AddOns)
                .HasForeignKey(oia => oia.OrderItemId);

            modelBuilder.Entity<OrderItemAddOn>()
                .HasOne(oia => oia.AddOn)
                .WithMany(a => a.OrderItemAddOns)
                .HasForeignKey(oia => oia.AddOnId);

            modelBuilder.Entity<Ingredient>()
                .HasMany(i => i.StockLogs)
                .WithOne(log => log.Ingredient)
                .HasForeignKey(log => log.IngredientId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<IngredientBatch>()
                .HasMany(b => b.StockLogs)
                .WithOne(log => log.Batch)
                .HasForeignKey(log => log.BatchId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
