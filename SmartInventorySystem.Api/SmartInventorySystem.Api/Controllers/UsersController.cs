using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SmartInventorySystem.Api.Models.DTOs;
using SmartInventorySystem.Api.Services.Users;

namespace SmartInventorySystem.Api.Controllers
{
    [ApiController]
    [Route("api/admin/users")]
    [Authorize(Roles = "Admin, SalesExecutive")]
    public class UsersController(IUserAdminService userAdminService) : Controller
    {
        private readonly IUserAdminService _userAdminService = userAdminService;

        [HttpGet]
        public async Task<IActionResult> GetAllUsers()
        {
            return Ok(await _userAdminService.GetAllUsersAsync());
        }

        // update role
        [HttpPut("{userId}/role")]
        public async Task<IActionResult> UpdateUserRole(string userId, UserRoleDto dto)
        {
            try
            {
                await _userAdminService.UpdateUserRoleAsync(userId, dto);
                return Ok(new { message = "User role updated successfully" });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
        }
    }
}
