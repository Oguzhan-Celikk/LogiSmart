using LogiSmart.Core.Enums;

namespace LogiSmart.Core.Entities;

public class Vehicle : BaseEntity
{
    public string PlateNumber { get; set; } = string.Empty;
    public string Brand { get; set; } = string.Empty;
    public string Model { get; set; } = string.Empty;
    public int Year { get; set; }
    public decimal MaxLoadCapacityTons { get; set; }
    public VehicleStatus Status { get; set; } = VehicleStatus.Available;
    public int Mileage { get; set; }
    public DateTime LastMaintenanceDate { get; set; }

    // Navigation Properties
    public ICollection<Trip> Trips { get; set; } = new List<Trip>();
    public ICollection<MaintenanceLog> MaintenanceLogs { get; set; } = new List<MaintenanceLog>();
}