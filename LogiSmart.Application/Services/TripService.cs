using LogiSmart.Application.DTOs;
using LogiSmart.Core.Entities;
using LogiSmart.Core.Enums;
using LogiSmart.Core.Interfaces;

namespace LogiSmart.Application.Services;

public class TripService
{
    private readonly IUnitOfWork _uow;

    public TripService(IUnitOfWork uow) => _uow = uow;

    public async Task<(bool Success, string Message, int TripId)> CreateTripAsync(CreateTripDto dto)
    {
        // BUSINESS RULE: Vehicle must be available
        var vehicle = await _uow.Vehicles.GetByIdAsync(dto.VehicleId);
        if (vehicle == null) return (false, "Vehicle not found.", 0);
        if (vehicle.Status != VehicleStatus.Available)
            return (false, $"Vehicle is currently {vehicle.Status}. Cannot assign to a new trip.", 0);

        // BUSINESS RULE: Cargo weight must not exceed vehicle capacity
        if (dto.CargoWeightTons > vehicle.MaxLoadCapacityTons)
            return (false, $"Cargo weight exceeds vehicle capacity of {vehicle.MaxLoadCapacityTons} tons.", 0);

        // BUSINESS RULE: Driver must exist and have Driver role
        var driver = await _uow.Users.GetByIdAsync(dto.DriverId);
        if (driver == null || driver.Role != UserRole.Driver)
            return (false, "Invalid driver.", 0);

        var trip = new Trip
        {
            TripCode = $"TRP-{DateTime.UtcNow:yyyyMMdd}-{new Random().Next(1000, 9999)}",
            Origin = dto.Origin,
            Destination = dto.Destination,
            CargoWeightTons = dto.CargoWeightTons,
            CargoDescription = dto.CargoDescription,
            PlannedDepartureDate = dto.PlannedDepartureDate,
            EstimatedDistanceKm = dto.EstimatedDistanceKm,
            VehicleId = dto.VehicleId,
            DriverId = dto.DriverId,
            CustomerId = dto.CustomerId,
            OperationsManagerId = dto.OperationsManagerId,
            Status = TripStatus.Planned
        };

        // Update vehicle status
        vehicle.Status = VehicleStatus.OnTrip;
        _uow.Vehicles.Update(vehicle);

        await _uow.Trips.AddAsync(trip);
        await _uow.SaveChangesAsync();

        return (true, "Trip created successfully.", trip.Id);
    }

    public async Task<bool> UpdateTripStatusAsync(int tripId, string newStatus)
    {
        var trip = await _uow.Trips.GetByIdAsync(tripId);
        if (trip == null) return false;

        if (!Enum.TryParse<TripStatus>(newStatus, out var status)) return false;

        trip.Status = status;
        trip.UpdatedAt = DateTime.UtcNow;

        if (status == TripStatus.Delivered)
        {
            trip.DeliveryDate = DateTime.UtcNow;
            var vehicle = await _uow.Vehicles.GetByIdAsync(trip.VehicleId);
            if (vehicle != null)
            {
                vehicle.Status = VehicleStatus.Available;
                _uow.Vehicles.Update(vehicle);
            }
        }

        _uow.Trips.Update(trip);
        await _uow.SaveChangesAsync();
        return true;
    }

    public async Task<IEnumerable<TripResponseDto>> GetAllTripsAsync()
    {
        var trips = await _uow.Trips.GetAllWithIncludesAsync(t => t.Driver, t => t.Vehicle, t => t.Customer);
        // Note: In production use Include() via a custom repo method for navigation props
        return trips.Select(t => new TripResponseDto(
            t.Id, t.TripCode, t.Origin, t.Destination,
            t.CargoWeightTons, t.Status.ToString(),
            t.PlannedDepartureDate,
            t.Driver != null ? $"{t.Driver.FirstName} {t.Driver.LastName}" : $"Driver #{t.DriverId}",
            t.Vehicle != null ? t.Vehicle.PlateNumber : $"Vehicle #{t.VehicleId}",
            t.Customer != null ? $"{t.Customer.FirstName} {t.Customer.LastName}" : $"Customer #{t.CustomerId}"
        ));
    }

    public async Task<IEnumerable<TripResponseDto>> GetTripsByDriverAsync(int driverId)
    {
        var trips = await _uow.Trips.FindWithIncludesAsync(t => t.DriverId == driverId, t => t.Vehicle, t => t.Customer);
        return trips.Select(t => new TripResponseDto(
            t.Id, t.TripCode, t.Origin, t.Destination,
            t.CargoWeightTons, t.Status.ToString(),
            t.PlannedDepartureDate, "You", 
            t.Vehicle != null ? t.Vehicle.PlateNumber : $"Vehicle #{t.VehicleId}", 
            t.Customer != null ? $"{t.Customer.FirstName} {t.Customer.LastName}" : $"Customer #{t.CustomerId}"
        ));
    }
    
    public async Task<IEnumerable<TripResponseDto>> GetTripsByCustomerAsync(int customerId)
    {
        var trips = await _uow.Trips.FindWithIncludesAsync(t => t.CustomerId == customerId, t => t.Driver, t => t.Vehicle);
        return trips.Select(t => new TripResponseDto(
            t.Id, t.TripCode, t.Origin, t.Destination,
            t.CargoWeightTons, t.Status.ToString(),
            t.PlannedDepartureDate,
            t.Driver != null ? $"{t.Driver.FirstName} {t.Driver.LastName}" : $"Driver #{t.DriverId}",
            t.Vehicle != null ? t.Vehicle.PlateNumber : $"Vehicle #{t.VehicleId}",
            "You"
        ));
    }
}