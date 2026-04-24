namespace LogiSmart.Application.DTOs;

public record LoginRequestDto(string Email, string Password);

public record LoginResponseDto(string Token, string FullName, string Role, int UserId);

public record RegisterUserDto(
    string FirstName,
    string LastName,
    string Email,
    string Password,
    string Role,
    string? Department,
    string? PhoneNumber
);