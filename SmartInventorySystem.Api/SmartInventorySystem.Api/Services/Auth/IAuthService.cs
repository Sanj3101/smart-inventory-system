using SmartInventorySystem.Api.Models.DTOs;

namespace SmartInventorySystem.Api.Services.Auth
{
    public interface IAuthService
    {
        Task RegisterAsync(RegisterDto dto);
        Task<(string Token, string Role)> LoginAsync(LoginDto dto);
    }
}
