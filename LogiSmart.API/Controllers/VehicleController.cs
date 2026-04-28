using LogiSmart.Application.DTOs;
using LogiSmart.Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LogiSmart.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class VehicleController : ControllerBase
{
    private readonly VehicleService _vehicleService;

    public VehicleController(VehicleService vehicleService) => _vehicleService = vehicleService;

    [HttpGet("available")]
    [Authorize(Roles = "OperationsManager,Admin,MaintenanceTechnician")]
    public async Task<IActionResult> GetAvailable()
    {
        var vehicles = await _vehicleService.GetAvailableVehiclesAsync();
        return Ok(vehicles);
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> AddVehicle([FromBody] CreateVehicleDto dto)
    {
        var success = await _vehicleService.AddVehicleAsync(dto);
        if (!success) return Conflict(new { message = "Vehicle with this plate already exists." });
        return Created("", new { message = "Vehicle added successfully." });
    }

    [HttpPatch("{id:int}/maintenance")]
    [Authorize(Roles = "MaintenanceTechnician,Admin")]
    public async Task<IActionResult> SendToMaintenance(int id)
    {
        var success = await _vehicleService.SendToMaintenanceAsync(id);
        if (!success) return BadRequest(new { message = "Cannot send vehicle to maintenance (may be on a trip)." });
        return Ok(new { message = "Vehicle sent to maintenance." });
    }
}