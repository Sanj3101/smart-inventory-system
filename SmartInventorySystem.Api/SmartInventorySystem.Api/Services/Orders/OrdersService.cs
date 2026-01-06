using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using SmartInventorySystem.Api.Data;
using SmartInventorySystem.Api.Models;
using SmartInventorySystem.Api.Models.DTOs;
using SmartInventorySystem.Api.Models.Entities;

namespace SmartInventorySystem.Api.Services.Orders
{
    public class OrdersService(
        AppDbContext context,
        UserManager<ApplicationUser> userManager,
        NotificationService notificationService
    ) : IOrdersService
    {
        private readonly AppDbContext _context = context;
        private readonly UserManager<ApplicationUser> _userManager = userManager;
        private readonly NotificationService _notificationService = notificationService;

        //create
        public async Task<object> CreateOrder(
            CreateOrderDto dto,
            string currentUserEmail,
            bool isSalesExec)
        {
            var user = await _userManager.FindByEmailAsync(currentUserEmail)
                ?? throw new UnauthorizedAccessException();

            string customerId;

            if (isSalesExec)
            {
                if (string.IsNullOrWhiteSpace(dto.CustomerEmail))
                    throw new InvalidOperationException("Customer email is required");

                var customer = await _userManager.FindByEmailAsync(dto.CustomerEmail);

                if (customer == null || !await _userManager.IsInRoleAsync(customer, "Customer"))
                    throw new InvalidOperationException("Invalid customer email");

                customerId = customer.Id;
            }
            else
            {
                customerId = user.Id;
            }

            if (dto.Items == null || !dto.Items.Any())
                throw new InvalidOperationException("Order must contain at least one item");

            if (dto.Items.Any(i => i.Quantity <= 0))
                throw new InvalidOperationException("Invalid quantity");

            var warehouses = await _context.Warehouses.ToListAsync();
            int? assignedWarehouseId = null;

            foreach (var warehouse in warehouses)
            {
                bool canFulfill = true;

                foreach (var item in dto.Items)
                {
                    var stock = await _context.WarehouseProducts.FirstOrDefaultAsync(wp =>
                        wp.WarehouseId == warehouse.Id &&
                        wp.ProductId == item.ProductId);

                    if (stock == null ||
                        (stock.StockQuantity - stock.ReservedQuantity) < item.Quantity)
                    {
                        canFulfill = false;
                        break;
                    }
                }

                if (canFulfill)
                {
                    assignedWarehouseId = warehouse.Id;
                    break;
                }
            }

            if (assignedWarehouseId == null)
                throw new InvalidOperationException("No warehouse can fulfill this order");

            foreach (var item in dto.Items)
            {
                var stock = await _context.WarehouseProducts.FirstAsync(wp =>
                    wp.WarehouseId == assignedWarehouseId &&
                    wp.ProductId == item.ProductId);

                stock.ReservedQuantity += item.Quantity;
            }

            var order = new Order
            {
                CustomerId = customerId,
                CreatedById = user.Id,
                WarehouseId = assignedWarehouseId.Value,
                Status = OrderStatus.Created,
                CreatedAt = DateTime.UtcNow,
                IsPaid = true,
                OrderItems = new List<OrderItem>()
            };

            foreach (var item in dto.Items)
            {
                var product = await _context.Products.FindAsync(item.ProductId);

                order.OrderItems.Add(new OrderItem
                {
                    ProductId = item.ProductId,
                    Quantity = item.Quantity,
                    UnitPrice = product!.Price
                });
            }

            _context.Orders.Add(order);
            await _context.SaveChangesAsync();

            var warehouseManagers = await _userManager.GetUsersInRoleAsync("WarehouseManager");

            foreach (var wm in warehouseManagers.Where(w => w.WarehouseId == order.WarehouseId))
            {
                await _notificationService.NotifyUser(
                    wm.Id,
                    "New Order Created",
                    $"Order #{order.Id} is created and ready for processing",
                    order.Id
                );
            }

            return new { order.Id, order.Status };
        }

  
        // cancel
        public async Task CancelOrder(int orderId, string currentUserEmail)
        {
            var user = await _userManager.FindByEmailAsync(currentUserEmail);

            var order = await _context.Orders
                .Include(o => o.OrderItems)
                .FirstOrDefaultAsync(o => o.Id == orderId)
                ?? throw new KeyNotFoundException("Order not found");

            if (order.CustomerId != user!.Id && order.CreatedById != user.Id)
                throw new UnauthorizedAccessException();

            if (order.Status == OrderStatus.Shipped || order.Status == OrderStatus.Delivered)
                throw new InvalidOperationException("Order cannot be cancelled after shipping");

            foreach (var item in order.OrderItems)
            {
                var stock = await _context.WarehouseProducts.FirstAsync(wp =>
                    wp.WarehouseId == order.WarehouseId &&
                    wp.ProductId == item.ProductId);

                stock.ReservedQuantity -= item.Quantity;
            }

            order.Status = OrderStatus.Cancelled;
            await _context.SaveChangesAsync();

            await _notificationService.NotifyUsers(
                new[] { order.CustomerId, order.CreatedById }.Distinct(),
                "Order Cancelled",
                $"Order #{order.Id} has been cancelled",
                order.Id
            );
        }

        //finance
        public async Task<object> GetOrdersForFinance()
        {
            return await _context.Orders
                .Include(o => o.Customer)
                .Include(o => o.OrderItems)
                    .ThenInclude(i => i.Product)
                .Select(o => new
                {
                    o.Id,
                    CustomerEmail = o.Customer.Email,
                    o.Status,
                    o.IsPaid,
                    o.CreatedAt,
                    Items = o.OrderItems.Select(i => new
                    {
                        ProductName = i.Product.Name,
                        i.Quantity,
                        i.UnitPrice,
                        LineTotal = i.Quantity * i.UnitPrice
                    }),
                    TotalAmount = o.OrderItems.Sum(i => i.Quantity * i.UnitPrice)
                })
                .ToListAsync();
        }

        // fetch orders created by cust/sales exec
        public async Task<object> GetOrdersCreatedByMe(string currentUserEmail)
        {
            var user = await _userManager.FindByEmailAsync(currentUserEmail)
                ?? throw new UnauthorizedAccessException();

            return await _context.Orders
                .Where(o => o.CreatedById == user.Id || o.CustomerId == user.Id)
                .Include(o => o.Customer)
                .Include(o => o.OrderItems)
                    .ThenInclude(i => i.Product)
                .OrderByDescending(o => o.CreatedAt)
                .Select(o => new
                {
                    o.Id,
                    o.Status,
                    o.CreatedAt,
                    Customer = new { o.Customer.Email },
                    Items = o.OrderItems.Select(i => new
                    {
                        ProductName = i.Product.Name,
                        i.Quantity,
                        i.UnitPrice,
                        LineTotal = i.Quantity * i.UnitPrice
                    }),
                    TotalAmount = o.OrderItems.Sum(i => i.Quantity * i.UnitPrice)
                })
                .ToListAsync();
        }


        // fetch for warehouse
        public async Task<object> GetWarehouseOrders(string currentUserEmail)
        {
            var user = await _userManager.FindByEmailAsync(currentUserEmail)
                ?? throw new UnauthorizedAccessException();

            return await _context.Orders
                .Where(o => o.WarehouseId == user.WarehouseId)
                .Include(o => o.OrderItems)
                    .ThenInclude(i => i.Product)
                .Select(o => new
                {
                    o.Id,
                    o.Status,
                    o.CreatedAt,
                    Items = o.OrderItems.Select(i => new
                    {
                        i.ProductId,
                        ProductName = i.Product.Name,
                        i.Quantity
                    })
                })
                .ToListAsync();
        }


        //order status updates
        public async Task ApproveOrder(int orderId, string email) =>
            await ChangeStatus(orderId, email, OrderStatus.Created, OrderStatus.Approved);

        public async Task PackOrder(int orderId, string email) =>
            await ChangeStatus(orderId, email, OrderStatus.Approved, OrderStatus.Packed);

        public async Task ShipOrder(int orderId, string email) =>
            await ChangeStatus(orderId, email, OrderStatus.Packed, OrderStatus.Shipped, true);

        public async Task DeliverOrder(int orderId, string email) =>
            await ChangeStatus(orderId, email, OrderStatus.Shipped, OrderStatus.Delivered);

        private async Task ChangeStatus(
            int orderId,
            string email,
            OrderStatus required,
            OrderStatus next,
            bool deductStock = false)
        {
            var user = await _userManager.FindByEmailAsync(email);
            var order = await _context.Orders
                .Include(o => o.OrderItems)
                .FirstOrDefaultAsync(o => o.Id == orderId)
                ?? throw new KeyNotFoundException();

            if (order.WarehouseId != user!.WarehouseId)
                throw new UnauthorizedAccessException();

            if (order.Status != required)
                throw new InvalidOperationException();

            if (deductStock)
            {
                foreach (var item in order.OrderItems)
                {
                    var stock = await _context.WarehouseProducts.FirstAsync(wp =>
                        wp.WarehouseId == order.WarehouseId &&
                        wp.ProductId == item.ProductId);

                    stock.ReservedQuantity -= item.Quantity;
                    stock.StockQuantity -= item.Quantity;
                }
            }

            order.Status = next;
            await _context.SaveChangesAsync();

            await _notificationService.NotifyUsers(
                new[] { order.CustomerId, order.CreatedById }.Distinct(),
                $"Order {next}",
                $"Order #{order.Id} status changed to {next}",
                order.Id
            );
        }


        //invoice
        public async Task<object> GetInvoice(int orderId, string email, bool isFinance)
        {
            var order = await _context.Orders
                .Include(o => o.Customer)
                .Include(o => o.OrderItems)
                    .ThenInclude(i => i.Product)
                .FirstOrDefaultAsync(o => o.Id == orderId)
                ?? throw new KeyNotFoundException();

            if (order.Status != OrderStatus.Shipped &&
                order.Status != OrderStatus.Delivered)
                throw new InvalidOperationException("Invoice available after shipment");

            var user = await _userManager.FindByEmailAsync(email);

            if (!isFinance &&
                order.CustomerId != user!.Id &&
                order.CreatedById != user.Id)
                throw new UnauthorizedAccessException();

            return new
            {
                InvoiceNumber = $"INV-{order.Id:D6}",
                order.CreatedAt,
                Customer = new { order.Customer.Email },
                Items = order.OrderItems.Select(i => new
                {
                    i.Product.Name,
                    i.Quantity,
                    i.UnitPrice,
                    Total = i.Quantity * i.UnitPrice
                }),
                GrandTotal = order.OrderItems.Sum(i => i.Quantity * i.UnitPrice),
                order.IsPaid
            };
        }
    }
}
