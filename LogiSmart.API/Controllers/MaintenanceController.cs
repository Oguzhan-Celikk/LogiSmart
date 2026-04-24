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
        var logs = await _uow.MaintenanceLogs.GetAllAsync();
        return Ok(logs);
    }

    [HttpGet("unresolved")]
    public async Task<IActionResult> GetUnresolved()
    {
        var logs = await _uow.MaintenanceLogs.FindAsync(m => !m.IsResolved);
        return Ok(logs);
    }

    [HttpPost]
    public async Task<IActionResult> LogMaintenance([FromBody] MaintenanceLog log)
    {
        await _uow.MaintenanceLogs.AddAsync(log);
        await _uow.SaveChangesAsync();
        return Created("", log);
    }

    [HttpPatch("{id:int}/resolve")]
    public async Task<IActionResult> ResolveIssue(int id, [FromBody] string resolutionNotes)
    {
        var log = await _uow.MaintenanceLogs.GetByIdAsync(id);
        if (log == null) return NotFound();

        log.IsResolved = true;
        log.ResolutionNotes = resolutionNotes;
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