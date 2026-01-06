using Microsoft.AspNetCore.Identity;
using SmartInventorySystem.Api.Data;
using SmartInventorySystem.Api.Models;
using SmartInventorySystem.Api.Models.DTOs;
using SmartInventorySystem.Api.Services.WarehosueManager;

namespace SmartInventorySystem.Api.Services.WarehouseManager
{
    public class WarehouseManagerService(
        AppDbContext context,
        UserManager<ApplicationUser> userManager,
        NotificationService notificationService
    ) : IWarehouseManagerService
    {
        private readonly AppDbContext _context = context;
        private readonly UserManager<ApplicationUser> _userManager = userManager;
        private readonly NotificationService _notificationService = notificationService;

        private async Task<ApplicationUser?> GetUser(string email)
        {
            return await _userManager.FindByEmailAsync(email);
        }


        // get warehouse asisgned
        public async Task<object> GetMyWarehouseAsync(string currentUserEmail)
        {
            var user = await GetUser(currentUserEmail)
                ?? throw new UnauthorizedAccessException("Invalid user context");

            if (user.WarehouseId == null)
                throw new InvalidOperationException("Warehouse not assigned");

            var warehouse = _context.Warehouses
                .Where(w => w.Id == user.WarehouseId)
                .Select(w => new
                {
                    w.Id,
                    w.Name,
                    w.Location
                })
                .FirstOrDefault();

            return warehouse!;
        }


        // get stock
        public async Task<object> GetStockAsync(string currentUserEmail)
        {
            var user = await GetUser(currentUserEmail)
                ?? throw new UnauthorizedAccessException();

            if (user.WarehouseId == null)
                throw new InvalidOperationException("Warehouse not assigned");

            return _context.WarehouseProducts
                .Where(wp => wp.WarehouseId == user.WarehouseId)
                .Select(wp => new
                {
                    ProductId = wp.ProductId,
                    ProductName = wp.Product.Name,
                    wp.StockQuantity
                })
                .ToList();
        }


        // update stock
        public async Task UpdateStockAsync(string currentUserEmail, UpdateStockDto dto)
        {
            var user = await GetUser(currentUserEmail)
                ?? throw new UnauthorizedAccessException();

            if (user.WarehouseId == null)
                throw new InvalidOperationException("Warehouse not assigned");

            var stock = _context.WarehouseProducts.FirstOrDefault(wp =>
                wp.WarehouseId == user.WarehouseId &&
                wp.ProductId == dto.ProductId
            );

            if (stock == null)
                throw new KeyNotFoundException("Product not found in this warehouse");

            stock.StockQuantity = dto.NewQuantity;
            _context.SaveChanges();


            // low stock alerts
            if (stock.StockQuantity <= 10) // will refactor to specific thereshold for each product :') 
            {
                var warehouseManagers =
                    await _userManager.GetUsersInRoleAsync("WarehouseManager");

                foreach (var wm in warehouseManagers.Where(w => w.WarehouseId == user.WarehouseId))
                {
                    await _notificationService.NotifyUser(
                        wm.Id,
                        "Low Stock Alert",
                        $"Product {stock.ProductId} is low on stock ({stock.StockQuantity} left)",
                        null,
                        stock.ProductId
                    );
                }
            }
        }
    }
}
