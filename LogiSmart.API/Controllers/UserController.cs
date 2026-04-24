using LogiSmart.Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LogiSmart.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class UserController : ControllerBase
{
    private readonly IUnitOfWork _uow;

    public UserController(IUnitOfWork uow) => _uow = uow;

    [HttpGet("role/{role}")]
    [Authorize(Roles = "Admin,OperationsManager")]
    public async Task<IActionResult> GetByRole(string role)
    {
        if (!Enum.TryParse<Core.Enums.UserRole>(role, out var userRole))
            return BadRequest(new { message = "Geçersiz rol." });

        var users = await _uow.Users.FindAsync(u => u.Role == userRole);
        return Ok(users.Select(u => new
        {
            u.Id,
            FullName = $"{u.FirstName} {u.LastName}",
            u.Email,
            u.PhoneNumber
        }));
    }
}