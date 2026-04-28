using LogiSmart.Core.Entities;
using LogiSmart.Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LogiSmart.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "MaintenanceTechnician,Admin")]
public class MaintenanceController : ControllerBase
{
    private readonly IUnitOfWork _uow;

    public MaintenanceController(IUnitOfWork uow) => _uow = uow;

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var logs = await _uow.MaintenanceLogs.GetAllWithIncludesAsync(m => m.Vehicle, m => m.Technician);
        var result = logs.Select(m => new
        {
            m.Id,
            m.VehicleId,
            VehiclePlate = m.Vehicle?.PlateNumber ?? $"Vehicle #{m.VehicleId}",
            m.TechnicianId,
            TechnicianName = m.Technician != null ? $"{m.Technician.FirstName} {m.Technician.LastName}" : $"Technician #{m.TechnicianId}",
            m.ReportedDate,
            m.ResolvedDate,
            m.IssueDescription,
            m.ResolutionNotes,
            m.RepairCost,
            m.IsResolved
        });
        return Ok(result);
    }

    [HttpGet("unresolved")]
    public async Task<IActionResult> GetUnresolved()
    {
        var logs = await _uow.MaintenanceLogs.FindWithIncludesAsync(m => !m.IsResolved, m => m.Vehicle, m => m.Technician);
        var result = logs.Select(m => new
        {
            m.Id,
            m.VehicleId,
            VehiclePlate = m.Vehicle?.PlateNumber ?? $"Vehicle #{m.VehicleId}",
            m.TechnicianId,
            TechnicianName = m.Technician != null ? $"{m.Technician.FirstName} {m.Technician.LastName}" : $"Technician #{m.TechnicianId}",
            m.ReportedDate,
            m.ResolvedDate,
            m.IssueDescription,
            m.ResolutionNotes,
            m.RepairCost,
            m.IsResolved
        });
        return Ok(result);
    }

    [HttpPost]
    public async Task<IActionResult> LogMaintenance([FromBody] MaintenanceLog log)
    {
        log.ReportedDate = DateTime.UtcNow;
        await _uow.MaintenanceLogs.AddAsync(log);

        var vehicle = await _uow.Vehicles.GetByIdAsync(log.VehicleId);
        if (vehicle != null)
        {
            vehicle.Status = Core.Enums.VehicleStatus.UnderMaintenance;
            _uow.Vehicles.Update(vehicle);
        }

        await _uow.SaveChangesAsync();
        return Created("", log);
    }

    [HttpPatch("{id:int}/resolve")]
    public async Task<IActionResult> ResolveIssue(int id, [FromBody] ResolveMaintenanceDto dto)
    {
        var log = await _uow.MaintenanceLogs.GetByIdAsync(id);
        if (log == null) return NotFound();

        log.IsResolved = true;
        log.ResolutionNotes = dto.ResolutionNotes;
        log.RepairCost = dto.RepairCost;
        log.ResolvedDate = DateTime.UtcNow;
        _uow.MaintenanceLogs.Update(log);

        // Restore vehicle to available
        var vehicle = await _uow.Vehicles.GetByIdAsync(log.VehicleId);
        if (vehicle != null)
        {
            vehicle.Status = Core.Enums.VehicleStatus.Available;
            vehicle.LastMaintenanceDate = DateTime.UtcNow;
            _uow.Vehicles.Update(vehicle);
        }

        await _uow.SaveChangesAsync();
        return Ok(new { message = "Issue resolved, vehicle restored to available." });
    }
}

public class ResolveMaintenanceDto
{
    public string ResolutionNotes { get; set; } = string.Empty;
    public decimal RepairCost { get; set; }
}