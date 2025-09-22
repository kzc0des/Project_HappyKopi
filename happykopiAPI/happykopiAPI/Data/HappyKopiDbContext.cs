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

            modelBuilder.Entity<Ingredient>()
                .HasMany(i => i.StockLogs)
                .WithOne(log => log.Ingredient)
                .HasForeignKey(log => log.IngredientId);

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

            modelBuilder.Entity<Ingredient>()
                .Property(i => i.LastUpdated)
                .HasDefaultValueSql("GETUTCDATE()");

            modelBuilder.Entity<Transaction>()
                .Property(t => t.TransactionDate)
                .HasDefaultValueSql("GETUTCDATE()");

        }
    }
}
