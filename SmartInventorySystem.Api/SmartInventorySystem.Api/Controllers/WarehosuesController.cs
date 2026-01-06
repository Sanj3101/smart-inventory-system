using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SmartInventorySystem.Api.Models.DTOs;
using SmartInventorySystem.Api.Models.DTOs.Warehouse;
using SmartInventorySystem.Api.Services.Warehouses;

namespace SmartInventorySystem.Api.Controllers
{
    [ApiController]
    [Route("api/warehouses")]
    public class WarehousesController(IWarehouseService warehouseService) : ControllerBase
    {
        private readonly IWarehouseService _warehouseService = warehouseService;

        [Authorize(Roles = "Admin")]
        [HttpPost]
        public IActionResult Create(CreateWarehouseDto dto)
        {
            return Ok(_warehouseService.Create(dto));
        }

        [Authorize]
        [HttpGet]
        public IActionResult GetAll()
        {
            return Ok(_warehouseService.GetAll());
        }

        [Authorize(Roles = "Admin")]
        [HttpPost("assign")]
        public IActionResult AssignProductToWarehouse(WarehouseProductDto dto)
        {
            try
            {
                _warehouseService.AssignProductToWarehouse(dto);
                return Ok(new { message = "Product assigned to warehouse successfully" });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [Authorize]
        [HttpGet("{warehouseId}/stock")]
        public IActionResult GetWarehouseStock(int warehouseId)
        {
            try
            {
                return Ok(_warehouseService.GetWarehouseStock(warehouseId));
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
        }
    }
}
