using LogiSmart.Core.Enums;

namespace LogiSmart.Core.Entities;

public class Trip : BaseEntity
{
    public string TripCode { get; set; } = string.Empty;
    public string Origin { get; set; } = string.Empty;
    public string Destination { get; set; } = string.Empty;
    public decimal CargoWeightTons { get; set; }
    public string CargoDescription { get; set; } = string.Empty;
    public TripStatus Status { get; set; } = TripStatus.Planned;
    public DateTime PlannedDepartureDate { get; set; }
    public DateTime? ActualDepartureDate { get; set; }
    public DateTime? DeliveryDate { get; set; }
    public decimal EstimatedDistanceKm { get; set; }

    // Foreign Keys
    public int VehicleId { get; set; }
    public int DriverId { get; set; }
    public int CustomerId { get; set; }
    public int? OperationsManagerId { get; set; }

    // Navigation Properties
    public Vehicle Vehicle { get; set; } = null!;
    public User Driver { get; set; } = null!;
    public User Customer { get; set; } = null!;
    public User? OperationsManager { get; set; }
    public Invoice? Invoice { get; set; }
}