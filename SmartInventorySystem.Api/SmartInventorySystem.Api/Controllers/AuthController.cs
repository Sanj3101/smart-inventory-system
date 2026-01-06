using Microsoft.AspNetCore.Mvc;
using SmartInventorySystem.Api.Models.DTOs;
using SmartInventorySystem.Api.Services.Auth;

namespace SmartInventorySystem.Api.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController(IAuthService authService) : ControllerBase
    {
        private readonly IAuthService _authService = authService;

        // REGISTER
        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterDto dto)
        {
            try
            {
                await _authService.RegisterAsync(dto);
                return Ok(new { message = "User registered successfully" });
            }
            catch (ApplicationException ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        // LOGIN
        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDto dto)
        {
            try
            {
                var (token, role) = await _authService.LoginAsync(dto);
                return Ok(new { token, role });
            }
            catch (UnauthorizedAccessException)
            {
                return Unauthorized(new { error = "Invalid email or password" });
            }
        }
    }
}
