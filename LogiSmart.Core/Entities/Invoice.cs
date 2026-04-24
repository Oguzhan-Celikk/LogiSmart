namespace LogiSmart.Core.Entities;

public class Invoice : BaseEntity
{
    public string InvoiceNumber { get; set; } = string.Empty;
    public decimal FuelCost { get; set; }
    public decimal DriverAllowance { get; set; }
    public decimal MaintenanceCost { get; set; }
    public decimal ServiceFee { get; set; }
    public decimal TotalAmount { get; set; }
    public bool IsPaid { get; set; } = false;
    public DateTime? PaidDate { get; set; }
    public DateTime IssueDate { get; set; } = DateTime.UtcNow;

    // Foreign Keys
    public int TripId { get; set; }
    public int FinanceSpecialistId { get; set; }

    // Navigation Properties
    public Trip Trip { get; set; } = null!;
    public User FinanceSpecialist { get; set; } = null!;
}