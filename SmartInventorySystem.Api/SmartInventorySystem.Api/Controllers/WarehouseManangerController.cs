using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SmartInventorySystem.Api.Models.DTOs;
using SmartInventorySystem.Api.Services.WarehosueManager;
using SmartInventorySystem.Api.Services.WarehouseManager;

namespace SmartInventorySystem.Api.Controllers
{
    [ApiController]
    [Route("api/warehouse-manager")]
    [Authorize(Roles = "WarehouseManager")]
    public class WarehouseManagerController(
        IWarehouseManagerService warehouseManagerService
    ) : ControllerBase
    {
        private readonly IWarehouseManagerService _service = warehouseManagerService;

        [HttpGet("warehouse")]
        public async Task<IActionResult> GetMyWarehouse()
        {
            try
            {
                return Ok(await _service.GetMyWarehouseAsync(User.Identity!.Name!));
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(new { message = ex.Message });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("stock")]
        public async Task<IActionResult> GetStock()
        {
            try
            {
                return Ok(await _service.GetStockAsync(User.Identity!.Name!));
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPut("stock")]
        public async Task<IActionResult> UpdateStock(UpdateStockDto dto)
        {
            try
            {
                await _service.UpdateStockAsync(User.Identity!.Name!, dto);
                return Ok(new { message = "Stock updated successfully" });
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}
