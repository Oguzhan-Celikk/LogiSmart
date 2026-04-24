using LogiSmart.Application.DTOs;
using LogiSmart.Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LogiSmart.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class TripController : ControllerBase
{
    private readonly TripService _tripService;

    public TripController(TripService tripService) => _tripService = tripService;

    [HttpGet]
    [Authorize(Roles = "Admin,OperationsManager,FinanceSpecialist")]
    public async Task<IActionResult> GetAll()
    {
        var trips = await _tripService.GetAllTripsAsync();
        return Ok(trips);
    }

    [HttpGet("my-trips/{driverId:int}")]
    [Authorize(Roles = "Driver")]
    public async Task<IActionResult> GetDriverTrips(int driverId)
    {
        var trips = await _tripService.GetTripsByDriverAsync(driverId);
        return Ok(trips);
    }

    [HttpPost]
    [Authorize(Roles = "OperationsManager,Admin")]
    public async Task<IActionResult> CreateTrip([FromBody] CreateTripDto dto)
    {
        var (success, message, tripId) = await _tripService.CreateTripAsync(dto);
        if (!success) return BadRequest(new { message });
        return CreatedAtAction(nameof(GetAll), new { id = tripId }, new { message, tripId });
    }

    [HttpPatch("{id:int}/status")]
    [Authorize(Roles = "Driver,OperationsManager,Admin")]
    public async Task<IActionResult> UpdateStatus(int id, [FromBody] UpdateTripStatusDto dto)
    {
        var success = await _tripService.UpdateTripStatusAsync(id, dto.Status);
        if (!success) return BadRequest(new { message = "Invalid status or trip not found." });
        return Ok(new { message = "Trip status updated." });
    }
    
    [HttpGet("my-trips/customer/{customerId:int}")]
    [Authorize(Roles = "Customer,Admin")]
    public async Task<IActionResult> GetCustomerTrips(int customerId)
    {
        var trips = await _tripService.GetTripsByCustomerAsync(customerId);
        return Ok(trips);
    }
}