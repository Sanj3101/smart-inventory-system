using Microsoft.EntityFrameworkCore;
using SmartInventorySystem.Api.Data;
using SmartInventorySystem.Api.Models;
using SmartInventorySystem.Api.Models.DTOs;

namespace SmartInventorySystem.Api.Services.Reports
{
    public class ReportsService(AppDbContext context) : IReportsService
    {
        private readonly AppDbContext _context = context;


        //sales by date
        public List<SalesByDateDto> GetSalesByDate(DateTime from, DateTime to)
        {
            return _context.OrderItems
                .Where(oi =>
                    oi.Order.Status == OrderStatus.Delivered &&
                    oi.Order.CreatedAt >= from &&
                    oi.Order.CreatedAt <= to
                )
                .GroupBy(oi => oi.Order.CreatedAt.Date)
                .Select(g => new SalesByDateDto
                {
                    Date = g.Key,
                    TotalQuantity = g.Sum(x => x.Quantity),
                    TotalRevenue = g.Sum(x => x.Quantity * x.UnitPrice)
                })
                .OrderBy(x => x.Date)
                .ToList();
        }


        // sales by product
        public List<SalesByProductDto> GetSalesByProduct(DateTime from, DateTime to)
        {
            return _context.OrderItems
                .Where(oi =>
                    oi.Order.Status == OrderStatus.Delivered &&
                    oi.Order.CreatedAt >= from &&
                    oi.Order.CreatedAt <= to
                )
                .GroupBy(oi => new { oi.ProductId, oi.Product.Name })
                .Select(g => new SalesByProductDto
                {
                    ProductName = g.Key.Name,
                    TotalQuantity = g.Sum(x => x.Quantity),
                    TotalRevenue = g.Sum(x => x.Quantity * x.UnitPrice)
                })
                .OrderByDescending(x => x.TotalQuantity)
                .ToList();
        }


        // inventory status
        public List<InventoryStatusDto> GetInventoryStatus()
        {
            return _context.WarehouseProducts
                .GroupBy(wp => new { wp.ProductId, wp.Product.Name })
                .Select(g => new InventoryStatusDto
                {
                    ProductId = g.Key.ProductId,
                    ProductName = g.Key.Name,
                    AvailableQuantity = g.Sum(x => x.StockQuantity - x.ReservedQuantity),
                    Status =
                        g.Sum(x => x.StockQuantity - x.ReservedQuantity) == 0
                            ? "OutOfStock"
                            : g.Sum(x => x.StockQuantity - x.ReservedQuantity) < 10
                                ? "LowStock"
                                : "InStock"
                })
                .OrderBy(x => x.ProductName)
                .ToList();
        }


        // top products
        public List<TopProductDto> GetTopSellingProducts(int limit)
        {
            return _context.OrderItems
                .Where(oi => oi.Order.Status == OrderStatus.Delivered)
                .GroupBy(oi => new { oi.ProductId, oi.Product.Name })
                .Select(g => new TopProductDto
                {
                    ProductId = g.Key.ProductId,
                    ProductName = g.Key.Name,
                    UnitsSold = g.Sum(x => x.Quantity),
                    Revenue = g.Sum(x => x.Quantity * x.UnitPrice)
                })
                .OrderByDescending(x => x.UnitsSold)
                .Take(limit)
                .ToList();
        }
    }
}
