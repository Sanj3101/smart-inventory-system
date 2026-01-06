using Microsoft.EntityFrameworkCore;
using SmartInventorySystem.Api.Data;
using SmartInventorySystem.Api.Models.DTOs;
using SmartInventorySystem.Api.Models.Entities;
using SmartInventorySystem.Api.Services.Products;
using Xunit;

namespace SmartInventorySystem.Api.Tests.Products
{
    public class ProductServiceTests
    {
        private AppDbContext GetDbContext()
        {
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(Guid.NewGuid().ToString())
                .Options;

            return new AppDbContext(options);
        }

        [Fact]
        public void Create_Throws_WhenCategoryInvalid()
        {
            var context = GetDbContext();
            var service = new ProductService(context);

            Assert.Throws<InvalidOperationException>(() =>
                service.Create(new ProductDto
                {
                    Name = "Phone",
                    Price = 100,
                    CategoryId = 99
                })
            );
        }

        // updating non existing product
        [Fact]
        public void Update_Throws_WhenProductNotFound()
        {
            var context = GetDbContext();
            var service = new ProductService(context);

            Assert.Throws<KeyNotFoundException>(() =>
                service.Update(1, new UpdateProductDto
                {
                    Name = "Phone",
                    Price = 500,
                    CategoryId = 1,
                    IsActive = true
                })
            );
        }

        // deactivate product
        [Fact]
        public void Deactivate_MarksProductInactive()
        {
            var context = GetDbContext();

            var category = new Category { Name = "Electronics" };
            context.Categories.Add(category);
            context.SaveChanges();

            var service = new ProductService(context);

            service.Create(new ProductDto
            {
                Name = "Phone",
                Price = 1000,
                CategoryId = category.Id
            });

            var productId = context.Products.Single().Id;

            service.Deactivate(productId);

            var updated = context.Products.Find(productId);
            Assert.False(updated!.IsActive);
        }


        // reactivate product
        [Fact]
        public void Reactivate_Throws_WhenAlreadyActive()
        {
            var context = GetDbContext();

            var category = new Category { Name = "Electronics" };
            context.Categories.Add(category);
            context.SaveChanges();

            var service = new ProductService(context);

            service.Create(new ProductDto
            {
                Name = "Laptop",
                Price = 2000,
                CategoryId = category.Id
            });

            var productId = context.Products.Single().Id;

            Assert.Throws<InvalidOperationException>(() =>
                service.Reactivate(productId)
            );
        }

        //non admin sees only active products

        [Fact]
        public void GetAll_ReturnsOnlyActiveProducts_ForNonAdmin()
        {
            var context = GetDbContext();
            var category = new Category { Name = "Electronics" };
            context.Categories.Add(category);
            context.SaveChanges();

            context.Products.AddRange(
                new Product { Name = "Active", Price = 100, CategoryId = category.Id, IsActive = true },
                new Product { Name = "Inactive", Price = 200, CategoryId = category.Id, IsActive = false }
            );
            context.SaveChanges();

            var service = new ProductService(context);

            var result = service.GetAll(isAdmin: false) as IEnumerable<object>;

            Assert.Single(result!);
        }


        // adimn sees all 

        [Fact]
        public void GetAll_ReturnsAllProducts_ForAdmin()
        {
            var context = GetDbContext();
            var category = new Category { Name = "Electronics" };
            context.Categories.Add(category);
            context.SaveChanges();

            context.Products.AddRange(
                new Product { Name = "A", Price = 100, CategoryId = category.Id, IsActive = true },
                new Product { Name = "B", Price = 200, CategoryId = category.Id, IsActive = false }
            );
            context.SaveChanges();

            var service = new ProductService(context);

            var result = service.GetAll(isAdmin: true) as IEnumerable<object>;

            Assert.Equal(2, result!.Count());
        }






    }
}
