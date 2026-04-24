using LogiSmart.Application.DTOs;
using LogiSmart.Core.Entities;
using LogiSmart.Core.Enums;
using LogiSmart.Core.Interfaces;

namespace LogiSmart.Application.Services;

public class VehicleService
{
    private readonly IUnitOfWork _uow;

    public VehicleService(IUnitOfWork uow) => _uow = uow;

    public async Task<bool> AddVehicleAsync(CreateVehicleDto dto)
    {
        var exists = await _uow.Vehicles.AnyAsync(v => v.PlateNumber == dto.PlateNumber);
        if (exists) return false;

        var vehicle = new Vehicle
        {
            PlateNumber = dto.PlateNumber,
            Brand = dto.Brand,
            Model = dto.Model,
            Year = dto.Year,
            MaxLoadCapacityTons = dto.MaxLoadCapacityTons,
            Status = VehicleStatus.Available,
            LastMaintenanceDate = DateTime.UtcNow
        };

        await _uow.Vehicles.AddAsync(vehicle);
        await _uow.SaveChangesAsync();
        return true;
    }

    public async Task<IEnumerable<VehicleResponseDto>> GetAvailableVehiclesAsync()
    {
        var vehicles = await _uow.Vehicles.FindAsync(v => v.Status == VehicleStatus.Available);
        return vehicles.Select(v => new VehicleResponseDto(
            v.Id, v.PlateNumber, v.Brand, v.Model, v.Status.ToString(),
            v.MaxLoadCapacityTons, v.Mileage));
    }

    public async Task<bool> SendToMaintenanceAsync(int vehicleId)
    {
        var vehicle = await _uow.Vehicles.GetByIdAsync(vehicleId);
        if (vehicle == null || vehicle.Status == VehicleStatus.OnTrip) return false;

        vehicle.Status = VehicleStatus.UnderMaintenance;
        vehicle.UpdatedAt = DateTime.UtcNow;
        _uow.Vehicles.Update(vehicle);
        await _uow.SaveChangesAsync();
        return true;
    }
}