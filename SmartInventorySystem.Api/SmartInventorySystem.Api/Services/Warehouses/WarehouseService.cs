using SmartInventorySystem.Api.Data;
using SmartInventorySystem.Api.Models.DTOs;
using SmartInventorySystem.Api.Models.DTOs.Warehouse;
using SmartInventorySystem.Api.Models.Entities;

namespace SmartInventorySystem.Api.Services.Warehouses
{
    public class WarehouseService(AppDbContext context) : IWarehouseService
    {
        private readonly AppDbContext _context = context;


        // create warehouse by admin
        public object Create(CreateWarehouseDto dto)
        {
            var warehouse = new Warehouse
            {
                Name = dto.Name,
                Location = dto.Location
            };

            _context.Warehouses.Add(warehouse);
            _context.SaveChanges();

            return warehouse;
        }


        //get all warehouses by admin
        public List<object> GetAll()
        {
            return _context.Warehouses
                .Select(w => new
                {
                    w.Id,
                    w.Name,
                    w.Location
                })
                .Cast<object>()
                .ToList();
        }

        // add products to warehouse
        public void AssignProductToWarehouse(WarehouseProductDto dto)
        {
            if (!_context.Warehouses.Any(w => w.Id == dto.WarehouseId))
                throw new InvalidOperationException("Invalid warehouse");

            if (!_context.Products.Any(p => p.Id == dto.ProductId))
                throw new InvalidOperationException("Invalid product");

            var exists = _context.WarehouseProducts.Any(wp =>
                wp.WarehouseId == dto.WarehouseId &&
                wp.ProductId == dto.ProductId
            );

            if (exists)
                throw new InvalidOperationException("Product already exists in this warehouse");

            _context.WarehouseProducts.Add(new WarehouseProduct
            {
                WarehouseId = dto.WarehouseId,
                ProductId = dto.ProductId,
                StockQuantity = dto.StockQuantity
            });

            _context.SaveChanges();
        }


        // get warehouse stock
        public List<object> GetWarehouseStock(int warehouseId)
        {
            var exists = _context.Warehouses.Any(w => w.Id == warehouseId);
            if (!exists)
                throw new KeyNotFoundException("Warehouse not found");

            return _context.WarehouseProducts
                .Where(wp => wp.WarehouseId == warehouseId)
                .Select(wp => new
                {
                    wp.ProductId,
                    ProductName = wp.Product.Name,
                    wp.StockQuantity
                })
                .Cast<object>()
                .ToList();
        }
    }
}
