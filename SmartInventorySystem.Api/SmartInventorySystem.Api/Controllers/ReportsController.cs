using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SmartInventorySystem.Api.Services.Reports;

namespace SmartInventorySystem.Api.Controllers
{
    [ApiController]
    [Route("api/reports")]
    [Authorize]
    public class ReportsController(IReportsService reportsService) : ControllerBase
    {
        private readonly IReportsService _reportsService = reportsService;

        // sales report (by DATE)
        [HttpGet("sales/by-date")]
        public IActionResult GetSalesByDate(
            [FromQuery] DateTime from,
            [FromQuery] DateTime to
        )
        {
            return Ok(_reportsService.GetSalesByDate(from, to));
        }

        // sales report (by PRODUCT)
        [HttpGet("sales/by-product")]
        public IActionResult GetSalesByProduct(
            [FromQuery] DateTime from,
            [FromQuery] DateTime to
        )
        {
            return Ok(_reportsService.GetSalesByProduct(from, to));
        }

        // inventory status report
        [HttpGet("inventory")]
        public IActionResult GetInventoryStatus()
        {
            return Ok(_reportsService.GetInventoryStatus());
        }

        // top selling prodcuts
        [HttpGet("top-products")]
        public IActionResult GetTopSellingProducts([FromQuery] int limit = 5)
        {
            return Ok(_reportsService.GetTopSellingProducts(limit));
        }
    }
}
