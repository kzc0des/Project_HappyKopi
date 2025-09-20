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

            // --- Pagtukoy sa mga Relationships at Constraints ---

            // Para sa ProductIngredient (Many-to-Many relationship sa pagitan ng Product at Ingredient)
            modelBuilder.Entity<ProductIngredient>()
                .HasKey(pi => new { pi.ProductId, pi.IngredientId }); // Composite Key

            modelBuilder.Entity<ProductIngredient>()
                .HasOne(pi => pi.Product)
                .WithMany(p => p.Recipe)
                .HasForeignKey(pi => pi.ProductId);

            modelBuilder.Entity<ProductIngredient>()
                .HasOne(pi => pi.Ingredient)
                .WithMany(i => i.Recipe)
                .HasForeignKey(pi => pi.IngredientId);

            // Para sa Order at OrderItem (One-to-Many relationship)
            modelBuilder.Entity<Order>()
                .HasMany(o => o.OrderItems)
                .WithOne(oi => oi.Order)
                .HasForeignKey(oi => oi.OrderId);

            // Para sa Order at Transaction (One-to-One relationship)
            modelBuilder.Entity<Order>()
                .HasOne(o => o.Transaction)
                .WithOne(t => t.Order)
                .HasForeignKey<Transaction>(t => t.OrderId);
                
            // Para sa Product at Category (One-to-Many relationship)
            modelBuilder.Entity<Category>()
                .HasMany(c => c.Products)
                .WithOne(p => p.Category)
                .HasForeignKey(p => p.CategoryId);

            // Para sa Ingredient at IngredientStockLog (One-to-Many relationship)
            modelBuilder.Entity<Ingredient>()
                .HasMany(i => i.StockLogs)
                .WithOne(log => log.Ingredient)
                .HasForeignKey(log => log.IngredientId);

            // --- Pagtukoy sa Data Types para sa SQL ---

            // Siguraduhing tama ang precision para sa mga presyo
            modelBuilder.Entity<Product>()
                .Property(p => p.Price)
                .HasColumnType("decimal(18,2)");

            modelBuilder.Entity<OrderItem>()
                .Property(oi => oi.UnitPrice)
                .HasColumnType("decimal(18,2)");
                
            modelBuilder.Entity<Order>()
                .Property(o => o.TotalAmount)
                .HasColumnType("decimal(18,2)");

            modelBuilder.Entity<Transaction>()
                .Property(t => t.AmountPaid)
                .HasColumnType("decimal(18,2)");

            modelBuilder.Entity<Transaction>()
                .Property(t => t.Change)
                .HasColumnType("decimal(18,2)");

            // --- Pagtukoy sa Enum to String conversion ---
            // Para mas madaling basahin sa database ang values ng enums
            
            modelBuilder.Entity<User>()
                .Property(u => u.Role)
                .HasConversion<string>();

            modelBuilder.Entity<Order>()
                .Property(o => o.Status)
                .HasConversion<string>();

            modelBuilder.Entity<Transaction>()
                .Property(t => t.PaymentType)
                .HasConversion<string>();
        }
    }
}
