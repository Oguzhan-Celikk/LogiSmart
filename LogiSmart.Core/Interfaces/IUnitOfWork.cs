using LogiSmart.Core.Entities;

namespace LogiSmart.Core.Interfaces;

public interface IUnitOfWork : IDisposable
{
    IRepository<User> Users { get; }
    IRepository<Vehicle> Vehicles { get; }
    IRepository<Trip> Trips { get; }
    IRepository<MaintenanceLog> MaintenanceLogs { get; }
    IRepository<Invoice> Invoices { get; }
    Task<int> SaveChangesAsync();
}