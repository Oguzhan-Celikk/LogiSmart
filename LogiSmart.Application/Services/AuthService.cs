using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using LogiSmart.Application.DTOs;
using LogiSmart.Core.Entities;
using LogiSmart.Core.Enums;
using LogiSmart.Core.Interfaces;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace LogiSmart.Application.Services;

public class AuthService
{
    private readonly IUnitOfWork _uow;
    private readonly IConfiguration _config;

    public AuthService(IUnitOfWork uow, IConfiguration config)
    {
        _uow = uow;
        _config = config;
    }

    public async Task<LoginResponseDto?> LoginAsync(LoginRequestDto dto)
    {
        var user = await _uow.Users.FirstOrDefaultAsync(u => u.Email == dto.Email);
        if (user == null || !BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
            return null;

        var token = GenerateJwtToken(user);
        return new LoginResponseDto(token, $"{user.FirstName} {user.LastName}", user.Role.ToString(), user.Id);
    }

    public async Task<bool> RegisterAsync(RegisterUserDto dto)
    {
        var exists = await _uow.Users.AnyAsync(u => u.Email == dto.Email);
        if (exists) return false;

        if (!Enum.TryParse<UserRole>(dto.Role, out var role)) return false;

        var user = new User
        {
            FirstName = dto.FirstName,
            LastName = dto.LastName,
            Email = dto.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
            Role = role,
            Department = dto.Department,
            PhoneNumber = dto.PhoneNumber
        };

        await _uow.Users.AddAsync(user);
        await _uow.SaveChangesAsync();
        return true;
    }

    private string GenerateJwtToken(User user)
    {   
        var secret = _config["Jwt:Secret"]!;
        Console.WriteLine($"TOKEN SECRET: '{secret}' LENGTH: {secret.Length}");
        
        var key = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(_config["Jwt:Secret"]!));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(ClaimTypes.Role, user.Role.ToString()),
            new Claim(ClaimTypes.Name, $"{user.FirstName} {user.LastName}")
        };

        var token = new JwtSecurityToken(
            issuer: "LogiSmartAPI",
            audience: "LogiSmartClient",
            claims: claims,
            expires: DateTime.UtcNow.AddHours(8),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}