namespace LogiSmart.Application.DTOs;

public record CreateTripDto(
    string Origin,
    string Destination,
    decimal CargoWeightTons,
    string CargoDescription,
    DateTime PlannedDepartureDate,
    decimal EstimatedDistanceKm,
    int VehicleId,
    int DriverId,
    int CustomerId,
    int OperationsManagerId
);

public record TripResponseDto(
    int Id,
    string TripCode,
    string Origin,
    string Destination,
    decimal CargoWeightTons,
    string Status,
    DateTime PlannedDepartureDate,
    string DriverName,
    string VehiclePlate,
    string CustomerName
);

public record UpdateTripStatusDto(string Status);