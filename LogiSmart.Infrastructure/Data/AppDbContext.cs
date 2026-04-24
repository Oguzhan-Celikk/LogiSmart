using LogiSmart.Core.Entities;
using Microsoft.EntityFrameworkCore;

namespace LogiSmart.Infrastructure.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<User> Users => Set<User>();
    public DbSet<Vehicle> Vehicles => Set<Vehicle>();
    public DbSet<Trip> Trips => Set<Trip>();
    public DbSet<MaintenanceLog> MaintenanceLogs => Set<MaintenanceLog>();
    public DbSet<Invoice> Invoices => Set<Invoice>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Global soft-delete filter
        modelBuilder.Entity<User>().HasQueryFilter(u => !u.IsDeleted);
        modelBuilder.Entity<Vehicle>().HasQueryFilter(v => !v.IsDeleted);
        modelBuilder.Entity<Trip>().HasQueryFilter(t => !t.IsDeleted);

        // Trip → Driver (restrict to prevent cascade conflict)
        modelBuilder.Entity<Trip>()
            .HasOne(t => t.Driver)
            .WithMany(u => u.AssignedTrips)
            .HasForeignKey(t => t.DriverId)
            .OnDelete(DeleteBehavior.Restrict);

        // Trip → Customer
        modelBuilder.Entity<Trip>()
            .HasOne(t => t.Customer)
            .WithMany()
            .HasForeignKey(t => t.CustomerId)
            .OnDelete(DeleteBehavior.Restrict);

        // Trip → OperationsManager
        modelBuilder.Entity<Trip>()
            .HasOne(t => t.OperationsManager)
            .WithMany()
            .HasForeignKey(t => t.OperationsManagerId)
            .OnDelete(DeleteBehavior.SetNull);

        // Invoice → FinanceSpecialist
        modelBuilder.Entity<Invoice>()
            .HasOne(i => i.FinanceSpecialist)
            .WithMany()
            .HasForeignKey(i => i.FinanceSpecialistId)
            .OnDelete(DeleteBehavior.Restrict);

        // Invoice → Trip (one-to-one)
        modelBuilder.Entity<Invoice>()
            .HasOne(i => i.Trip)
            .WithOne(t => t.Invoice)
            .HasForeignKey<Invoice>(i => i.TripId)
            .OnDelete(DeleteBehavior.Cascade);

        // Unique constraints
        modelBuilder.Entity<User>().HasIndex(u => u.Email).IsUnique();
        modelBuilder.Entity<Vehicle>().HasIndex(v => v.PlateNumber).IsUnique();
        modelBuilder.Entity<Invoice>().HasIndex(i => i.InvoiceNumber).IsUnique();
        
        // Decimal precision'ları
        modelBuilder.Entity<Invoice>().Property(i => i.FuelCost).HasPrecision(10, 2);
        modelBuilder.Entity<Invoice>().Property(i => i.DriverAllowance).HasPrecision(10, 2);
        modelBuilder.Entity<Invoice>().Property(i => i.MaintenanceCost).HasPrecision(10, 2);
        modelBuilder.Entity<Invoice>().Property(i => i.ServiceFee).HasPrecision(10, 2);
        modelBuilder.Entity<Invoice>().Property(i => i.TotalAmount).HasPrecision(10, 2);
        modelBuilder.Entity<MaintenanceLog>().Property(m => m.RepairCost).HasPrecision(10, 2);
        modelBuilder.Entity<Trip>().Property(t => t.CargoWeightTons).HasPrecision(8, 2);
        modelBuilder.Entity<Trip>().Property(t => t.EstimatedDistanceKm).HasPrecision(8, 2);
        modelBuilder.Entity<Vehicle>().Property(v => v.MaxLoadCapacityTons).HasPrecision(6, 2);
        
    }
}