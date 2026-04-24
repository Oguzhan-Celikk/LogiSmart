using LogiSmart.Application.DTOs;
using LogiSmart.Application.Services;
using Microsoft.AspNetCore.Mvc;

namespace LogiSmart.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly AuthService _authService;

    public AuthController(AuthService authService) => _authService = authService;

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequestDto dto)
    {
        var result = await _authService.LoginAsync(dto);
        if (result == null) return Unauthorized(new { message = "Invalid email or password." });
        return Ok(result);
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterUserDto dto)
    {
        var success = await _authService.RegisterAsync(dto);
        if (!success) return BadRequest(new { message = "User already exists or invalid role." });
        return CreatedAtAction(nameof(Login), new { message = "User registered successfully." });
    }
}