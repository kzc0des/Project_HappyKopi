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
        public DbSet<ProductVariant> ProductVariants { get; set; }
        public DbSet<ProductVariantIngredient> ProductVariantIngredients { get; set; }
        public DbSet<ProductVariantAddOn> ProductVariantAddOns { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<StockItem> StockItems { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderItem> OrderItems { get; set; }
        public DbSet<Transaction> Transactions { get; set; }
        public DbSet<StockLog> StockLogs { get; set; }
        public DbSet<DailyIngredientSummary> DailyIngredientSummaries { get; set; }
        public DbSet<StockItemBatch> StockItemBatches { get; set; }
        public DbSet<Modifier> Modifiers { get; set; }
        public DbSet<OrderItemModifier> OrderItemModifiers { get; set; }
        public DbSet<ModifierStockItem> ModifierStockItems { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<ProductVariantAddOn>()
                .HasKey(pva => new { pva.ProductVariantId, pva.ModifierId });

            modelBuilder.Entity<ProductVariantIngredient>()
                .HasKey(pvi => new { pvi.ProductVariantId, pvi.StockItemId });

            modelBuilder.Entity<Product>()
                .HasMany(p => p.Variants)
                .WithOne(pv => pv.Product)
                .HasForeignKey(pv => pv.ProductId);

            modelBuilder.Entity<OrderItem>()
                .HasOne(oi => oi.ProductVariant)
                .WithMany() 
                .HasForeignKey(oi => oi.ProductVariantId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<ProductVariantIngredient>()
                .HasKey(pvi => new { pvi.ProductVariantId, pvi.StockItemId }); 

            modelBuilder.Entity<ProductVariantIngredient>()
                .HasOne(pvi => pvi.ProductVariant)
                .WithMany(pv => pv.Recipe) 
                .HasForeignKey(pvi => pvi.ProductVariantId);

            modelBuilder.Entity<ProductVariantIngredient>()
                .HasOne(pvi => pvi.StockItem)
                .WithMany(si => si.ProductVariantIngredients)
                .HasForeignKey(pvi => pvi.StockItemId);

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

            modelBuilder.Entity<StockLog>()
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

            modelBuilder.Entity<StockItem>()
                .HasMany(i => i.Batches)
                .WithOne(b => b.StockItem)
                .HasForeignKey(b => b.StockItemId);

            modelBuilder.Entity<StockItem>()
                .HasMany(i => i.StockLogs)
                .WithOne(log => log.StockItem)
                .HasForeignKey(log => log.StockItemId);

            modelBuilder.Entity<StockItem>()
                .Property(i => i.IsPerishable)
                .HasDefaultValue(false);

            modelBuilder.Entity<StockItemBatch>()
                .Property(b => b.DateReceived)
                .HasDefaultValueSql("GETUTCDATE()");

            modelBuilder.Entity<StockItem>()
                .Property(i => i.LastUpdated)
                .HasDefaultValueSql("GETUTCDATE()");

            modelBuilder.Entity<OrderItemModifier>()
                .HasOne(oia => oia.OrderItem)
                .WithMany(oi => oi.AddOns)
                .HasForeignKey(oia => oia.OrderItemId);

            modelBuilder.Entity<OrderItemModifier>()
                .HasOne(oia => oia.Modifier)
                .WithMany(a => a.OrderItemModifiers)
                .HasForeignKey(oia => oia.ModifierId);

            modelBuilder.Entity<StockItem>()
                .HasMany(i => i.StockLogs)
                .WithOne(log => log.StockItem)
                .HasForeignKey(log => log.StockItemId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<StockItemBatch>()
                .HasMany(b => b.StockLogs)
                .WithOne(log => log.Batch)
                .HasForeignKey(log => log.StockItemBatchId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<StockItem>()
                .Property(i => i.IsActive)
                .HasDefaultValue(true);

            modelBuilder.Entity<ModifierStockItem>()
                .Property(m => m.QuantityNeeded)
                .HasDefaultValue(1);

            modelBuilder.Entity<Product>()
                .Property(p => p.IsAvailable)
                .HasDefaultValue(true);

            modelBuilder.Entity<Product>()
                .Property(p => p.IsActive)
                .HasDefaultValue(true);

            modelBuilder.Entity<Modifier>()
                .Property(a => a.LastUpdated)
                .IsRequired()
                .HasDefaultValueSql("GETUTCDATE()");

            modelBuilder.Entity<Modifier>()
                .Property(m => m.IsActive)
                .HasDefaultValue(true);

            modelBuilder.Entity<Modifier>()
                .Property(p => p.IsAvailable)
                .HasDefaultValue(true);

            modelBuilder.Entity<Category>()
                .Property(c => c.IsActive)
                .HasDefaultValue(true);
        }
    }
}
