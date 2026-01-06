using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SmartInventorySystem.Api.Models.DTOs;
using SmartInventorySystem.Api.Services.Orders;

namespace SmartInventorySystem.Api.Controllers
{
    [ApiController]
    [Route("api/orders")]
    public class OrdersController(IOrdersService ordersService) : ControllerBase
    {
        private readonly IOrdersService _ordersService = ordersService;

        [Authorize(Roles = "Customer,SalesExecutive")]
        [HttpPost]
        public async Task<IActionResult> CreateOrder(CreateOrderDto dto)
        {
            try
            {
                var result = await _ordersService.CreateOrder(
                    dto,
                    User.Identity!.Name!,
                    User.IsInRole("SalesExecutive")
                );
                return Ok(result);
            }
            catch (Exception ex) when (ex is InvalidOperationException)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [Authorize(Roles = "Customer,SalesExecutive")]
        [HttpPut("{orderId}/cancel")]
        public async Task<IActionResult> CancelOrder(int orderId)
        {
            try
            {
                await _ordersService.CancelOrder(orderId, User.Identity!.Name!);
                return Ok(new { message = "Order cancelled successfully" });
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (UnauthorizedAccessException)
            {
                return Forbid();
            }
        }

        [Authorize(Roles = "FinanceOfficer")]
        [HttpGet("finance")]
        public async Task<IActionResult> GetOrdersForFinance() =>
            Ok(await _ordersService.GetOrdersForFinance());

        [Authorize]
        [HttpGet("{orderId}/invoice")]
        public async Task<IActionResult> GetInvoice(int orderId)
        {
            try
            {
                return Ok(await _ordersService.GetInvoice(
                    orderId,
                    User.Identity!.Name!,
                    User.IsInRole("FinanceOfficer")
                ));
            }
            catch (KeyNotFoundException)
            {
                return NotFound(new { message = "Order not found" });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (UnauthorizedAccessException)
            {
                return Forbid();
            }
        }

        [Authorize(Roles = "WarehouseManager")]
        [HttpPut("{orderId}/approve")]
        public async Task<IActionResult> ApproveOrder(int orderId)
        {
            await _ordersService.ApproveOrder(orderId, User.Identity!.Name!);
            return Ok(new { message = "Order approved" });
        }

        [Authorize(Roles = "WarehouseManager")]
        [HttpPut("{orderId}/pack")]
        public async Task<IActionResult> PackOrder(int orderId)
        {
            await _ordersService.PackOrder(orderId, User.Identity!.Name!);
            return Ok(new { message = "Order packed" });
        }

        [Authorize(Roles = "WarehouseManager")]
        [HttpPut("{orderId}/ship")]
        public async Task<IActionResult> ShipOrder(int orderId)
        {
            await _ordersService.ShipOrder(orderId, User.Identity!.Name!);
            return Ok(new { message = "Order shipped" });
        }

        [Authorize(Roles = "WarehouseManager")]
        [HttpPut("{orderId}/deliver")]
        public async Task<IActionResult> DeliverOrder(int orderId)
        {
            await _ordersService.DeliverOrder(orderId, User.Identity!.Name!);
            return Ok(new { message = "Order delivered" });
        }

        [Authorize(Roles = "Customer,SalesExecutive")]
        [HttpGet("created-by-me")]
        public async Task<IActionResult> GetOrdersCreatedByMe() =>
            Ok(await _ordersService.GetOrdersCreatedByMe(User.Identity!.Name!));

        [Authorize(Roles = "WarehouseManager")]
        [HttpGet("warehouse")]
        public async Task<IActionResult> GetWarehouseOrders() =>
            Ok(await _ordersService.GetWarehouseOrders(User.Identity!.Name!));
    }
}
