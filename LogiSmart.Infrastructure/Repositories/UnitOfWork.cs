using LogiSmart.Core.Entities;
using LogiSmart.Core.Interfaces;
using LogiSmart.Infrastructure.Data;

namespace LogiSmart.Infrastructure.Repositories;

public class UnitOfWork : IUnitOfWork
{
    private readonly AppDbContext _context;

    public IRepository<User> Users { get; }
    public IRepository<Vehicle> Vehicles { get; }
    public IRepository<Trip> Trips { get; }
    public IRepository<MaintenanceLog> MaintenanceLogs { get; }
    public IRepository<Invoice> Invoices { get; }

    public UnitOfWork(AppDbContext context)
    {
        _context = context;
        Users = new GenericRepository<User>(context);
        Vehicles = new GenericRepository<Vehicle>(context);
        Trips = new GenericRepository<Trip>(context);
        MaintenanceLogs = new GenericRepository<MaintenanceLog>(context);
        Invoices = new GenericRepository<Invoice>(context);
    }

    public async Task<int> SaveChangesAsync() =>
        await _context.SaveChangesAsync();

    public void Dispose() =>
        _context.Dispose();
}