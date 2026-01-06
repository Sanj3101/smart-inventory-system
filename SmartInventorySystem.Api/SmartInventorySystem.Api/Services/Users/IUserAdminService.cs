using SmartInventorySystem.Api.Models.DTOs;

namespace SmartInventorySystem.Api.Services.Users
{
    public interface IUserAdminService
    {
        Task<List<UserDto>> GetAllUsersAsync();
        Task UpdateUserRoleAsync(string userId, UserRoleDto dto);
    }
}
