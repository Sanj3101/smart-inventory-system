using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace SmartInventorySystem.Api.Controllers
{
    [ApiController]
    [Route("api/test")]
    public class TestAuthController : ControllerBase
    {
        //Any logged-in user
        [Authorize]
        [HttpGet("any")]
        public IActionResult AnyUser()
        {
            return Ok(new
            {
                message = "Any authenticated user can access this",
                user = User.Identity?.Name,
                roles = User.Claims
                            .Where(c => c.Type == ClaimTypes.Role)
                            .Select(c => c.Value)
            });
        }

        //Admin only
        [Authorize(Roles = "Admin")]
        [HttpGet("admin")]
        public IActionResult AdminOnly()
        {
            return Ok("Admin access granted");
        }

        //Customer only
        [Authorize(Roles = "Customer")]
        [HttpGet("customer")]
        public IActionResult CustomerOnly()
        {
            return Ok("Customer access granted");
        }

        //Sales Executive only
        [Authorize(Roles = "SalesExecutive")]
        [HttpGet("sales")]
        public IActionResult SalesOnly()
        {
            return Ok("Sales Executive access granted");
        }

        //Warehouse Manager only
        [Authorize(Roles = "WarehouseManager")]
        [HttpGet("warehouse")]
        public IActionResult WarehouseOnly()
        {
            return Ok("Warehouse Manager access granted");
        }

        //Finance Officer only
        [Authorize(Roles = "FinanceOfficer")]
        [HttpGet("finance")]
        public IActionResult FinanceOnly()
        {
            return Ok("Finance Officer access granted");
        }

        [AllowAnonymous]
        [HttpGet("ping")]
        public IActionResult Ping()
        {
            return Ok("API is alive");
        }

    }
}
