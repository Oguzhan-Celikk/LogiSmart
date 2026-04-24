namespace LogiSmart.Application.DTOs;

public record CreateVehicleDto(
    string PlateNumber,
    string Brand,
    string Model,
    int Year,
    decimal MaxLoadCapacityTons
);

public record VehicleResponseDto(
    int Id,
    string PlateNumber,
    string Brand,
    string Model,
    string Status,
    decimal MaxLoadCapacityTons,
    int Mileage
);