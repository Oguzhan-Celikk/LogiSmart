namespace LogiSmart.Core.Entities;

public class MaintenanceLog : BaseEntity
{
    public string IssueDescription { get; set; } = string.Empty;
    public string? ResolutionNotes { get; set; }
    public DateTime ReportedDate { get; set; } = DateTime.UtcNow;
    public DateTime? ResolvedDate { get; set; }
    public decimal RepairCost { get; set; }
    public bool IsResolved { get; set; } = false;

    // Foreign Keys
    public int VehicleId { get; set; }
    public int TechnicianId { get; set; }
    public int? TripId { get; set; }  // If breakdown occurred during a trip

    // Navigation Properties
    public Vehicle Vehicle { get; set; } = null!;
    public User Technician { get; set; } = null!;
    public Trip? Trip { get; set; }
}