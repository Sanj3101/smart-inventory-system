using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using SmartInventorySystem.Api.Models;
using SmartInventorySystem.Api.Models.Entities;

namespace SmartInventorySystem.Api.Data
{
    public class DataSeeder(IServiceProvider serviceProvider)
    {
        private readonly IServiceProvider _sp = serviceProvider;
        private const string DemoPassword = "Demo@123";

        public async Task SeedAsync()
        {
            using var scope = _sp.CreateScope();

            var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
            var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();
            var userManager = scope.ServiceProvider.GetRequiredService<UserManager<ApplicationUser>>();

            // ---------------------------
            // ROLES
            // ---------------------------
            string[] roles =
            {
                "Admin",
                "Customer",
                "SalesExecutive",
                "WarehouseManager",
                "FinanceOfficer"
            };

            foreach (var role in roles)
            {
                if (!await roleManager.RoleExistsAsync(role))
                    await roleManager.CreateAsync(new IdentityRole(role));
            }

            // ---------------------------
            // WAREHOUSES
            // ---------------------------
            var warehouses = new[]
            {
                new Warehouse { Name = "Bangalore Warehouse", Location = "Bangalore" },
                new Warehouse { Name = "Mumbai Warehouse", Location = "Mumbai" },
                new Warehouse { Name = "Delhi Warehouse", Location = "Delhi" }
            };

            context.Warehouses.AddRange(warehouses);
            await context.SaveChangesAsync();

            // ---------------------------
            // USERS
            // ---------------------------
            var admin = await CreateUser(userManager, "admin@sys.com", "Admin");
            var finance = await CreateUser(userManager, "finance@sys.com", "FinanceOfficer");

            var sales1 = await CreateUser(userManager, "sales1@sys.com", "SalesExecutive");
            var sales2 = await CreateUser(userManager, "sales2@sys.com", "SalesExecutive");

            var wm1 = await CreateUser(userManager, "warehouse.blr@sys.com", "WarehouseManager");
            wm1.WarehouseId = warehouses[0].Id;

            var wm2 = await CreateUser(userManager, "warehouse.mum@sys.com", "WarehouseManager");
            wm2.WarehouseId = warehouses[1].Id;

            var wm3 = await CreateUser(userManager, "warehouse.del@sys.com", "WarehouseManager");
            wm3.WarehouseId = warehouses[2].Id;

            await userManager.UpdateAsync(wm1);
            await userManager.UpdateAsync(wm2);
            await userManager.UpdateAsync(wm3);

            var customers = new[]
            {
                await CreateUser(userManager, "aarav.kumar@demo.com", "Customer"),
                await CreateUser(userManager, "neha.sharma@demo.com", "Customer"),
                await CreateUser(userManager, "rohit.verma@demo.com", "Customer"),
                await CreateUser(userManager, "ananya.singh@demo.com", "Customer"),
                await CreateUser(userManager, "rahul.mehta@demo.com", "Customer"),
                await CreateUser(userManager, "kavya.nair@demo.com", "Customer")
            };

            // ---------------------------
            // CATEGORIES
            // ---------------------------
            var categories = new[]
            {
                new Category { Name = "Electronics" },
                new Category { Name = "Home Appliances" },
                new Category { Name = "Furniture" },
                new Category { Name = "Clothing" },
                new Category { Name = "Groceries" },
                new Category { Name = "Stationery" }
            };

            context.Categories.AddRange(categories);
            await context.SaveChangesAsync();

            // ---------------------------
            // PRODUCTS
            // ---------------------------
            var products = new List<Product>
            {
                new() { Name = "iPhone 14", Price = 70000, CategoryId = categories[0].Id },
                new() { Name = "Samsung TV 55\"", Price = 45000, CategoryId = categories[0].Id },
                new() { Name = "Bluetooth Headphones", Price = 2500, CategoryId = categories[0].Id, IsActive = false },

                new() { Name = "Microwave Oven", Price = 12000, CategoryId = categories[1].Id },
                new() { Name = "Refrigerator", Price = 30000, CategoryId = categories[1].Id },

                new() { Name = "Office Chair", Price = 6000, CategoryId = categories[2].Id },
                new() { Name = "Dining Table", Price = 18000, CategoryId = categories[2].Id },

                new() { Name = "Men's Casual Shirt", Price = 1500, CategoryId = categories[3].Id },
                new() { Name = "Women's Jacket", Price = 3500, CategoryId = categories[3].Id },

                new() { Name = "Rice 10kg", Price = 650, CategoryId = categories[4].Id },
                new() { Name = "Cooking Oil 5L", Price = 900, CategoryId = categories[4].Id },

                new() { Name = "Notebook Pack", Price = 300, CategoryId = categories[5].Id },
                new() { Name = "Office Pens (Box)", Price = 200, CategoryId = categories[5].Id }
            };

            context.Products.AddRange(products);
            await context.SaveChangesAsync();

            // ---------------------------
            // INVENTORY (WAREHOUSE PRODUCTS)
            // ---------------------------
            var rand = new Random(42);

            foreach (var warehouse in warehouses)
            {
                foreach (var product in products)
                {
                    context.WarehouseProducts.Add(new WarehouseProduct
                    {
                        WarehouseId = warehouse.Id,
                        ProductId = product.Id,
                        StockQuantity = rand.Next(3, 80),
                        ReservedQuantity = rand.Next(0, 5)
                    });
                }
            }

            await context.SaveChangesAsync();

            // ---------------------------
            // ORDERS (LAST 45 DAYS)
            // ---------------------------
            var orders = new List<Order>();

            for (int i = 0; i < 28; i++)
            {
                var customer = customers[rand.Next(customers.Length)];
                var createdBy = rand.Next(2) == 0 ? customer : sales1;

                var orderDate = DateTime.UtcNow.AddDays(-rand.Next(1, 45));

                var order = new Order
                {
                    CustomerId = customer.Id,
                    CreatedById = createdBy.Id,
                    WarehouseId = warehouses[rand.Next(warehouses.Length)].Id,
                    CreatedAt = orderDate,
                    Status = (OrderStatus)rand.Next(0, 5),
                    IsPaid = true,
                    OrderItems = new List<OrderItem>()
                };

                var itemCount = rand.Next(1, 4);

                for (int j = 0; j < itemCount; j++)
                {
                    var product = products[rand.Next(products.Count)];

                    order.OrderItems.Add(new OrderItem
                    {
                        ProductId = product.Id,
                        Quantity = rand.Next(1, 5),
                        UnitPrice = product.Price
                    });
                }

                orders.Add(order);
            }

            context.Orders.AddRange(orders);
            await context.SaveChangesAsync();
        }

        private async Task<ApplicationUser> CreateUser(
            UserManager<ApplicationUser> userManager,
            string email,
            string role)
        {
            var user = await userManager.FindByEmailAsync(email);

            if (user == null)
            {
                user = new ApplicationUser
                {
                    UserName = email,
                    Email = email
                };

                await userManager.CreateAsync(user, DemoPassword);
            }

            if (!await userManager.IsInRoleAsync(user, role))
                await userManager.AddToRoleAsync(user, role);

            return user;
        }
    }
}
