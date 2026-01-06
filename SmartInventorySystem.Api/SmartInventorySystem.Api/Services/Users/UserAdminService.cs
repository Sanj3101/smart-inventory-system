using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using SmartInventorySystem.Api.Data;
using SmartInventorySystem.Api.Models;
using SmartInventorySystem.Api.Models.DTOs;

namespace SmartInventorySystem.Api.Services.Users
{
    public class UserAdminService(
        AppDbContext context,
        UserManager<ApplicationUser> userManager,
        RoleManager<IdentityRole> roleManager
    ) : IUserAdminService
    {
        private readonly AppDbContext _context = context;
        private readonly UserManager<ApplicationUser> _userManager = userManager;
        private readonly RoleManager<IdentityRole> _roleManager = roleManager;


        // get all users
        public async Task<List<UserDto>> GetAllUsersAsync()
        {
            var users = _userManager.Users.ToList();
            var result = new List<UserDto>();

            foreach (var user in users)
            {
                var roles = await _userManager.GetRolesAsync(user);

                result.Add(new UserDto
                {
                    Id = user.Id,
                    Email = user.Email,
                    Role = roles.FirstOrDefault(),
                    WarehouseId = user.WarehouseId
                });
            }

            return result;
        }


        // update user role
        public async Task UpdateUserRoleAsync(string userId, UserRoleDto dto)
        {
            if (!await _roleManager.RoleExistsAsync(dto.Role))
                throw new InvalidOperationException("Invalid role");

            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
                throw new KeyNotFoundException("User not found");

            if (dto.Role == "WarehouseManager" && dto.WarehouseId == null)
                throw new InvalidOperationException(
                    "WarehouseId is required for Warehouse Manager role"
                );

            var currentRoles = await _userManager.GetRolesAsync(user);

            // Clear warehouse id if leaving WarehouseManager role
            if (currentRoles.Contains("WarehouseManager") &&
                dto.Role != "WarehouseManager")
            {
                user.WarehouseId = null;
            }

            // Assign warehouse if needed
            if (dto.Role == "WarehouseManager")
            {
                var warehouseExists = await _context.Warehouses
                    .AnyAsync(w => w.Id == dto.WarehouseId);

                if (!warehouseExists)
                    throw new InvalidOperationException("Invalid warehouse");

                user.WarehouseId = dto.WarehouseId;
            }

            if (currentRoles.Any())
            {
                await _userManager.RemoveFromRolesAsync(user, currentRoles);
            }

            await _userManager.AddToRoleAsync(user, dto.Role);
            await _userManager.UpdateAsync(user);
        }
    }
}
