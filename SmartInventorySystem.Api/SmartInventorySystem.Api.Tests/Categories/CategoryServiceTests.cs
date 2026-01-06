using Microsoft.EntityFrameworkCore;
using SmartInventorySystem.Api.Data;
using SmartInventorySystem.Api.Models.DTOs;
using SmartInventorySystem.Api.Services.Categories;
using Xunit;

namespace SmartInventorySystem.Api.Tests.Categories
{
    public class CategoryServiceTests
    {
        private AppDbContext GetDbContext()
        {
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(Guid.NewGuid().ToString())
                .Options;

            return new AppDbContext(options);
        }

        [Fact]
        public void Create_AddsCategory()
        {
            // Arrange
            var context = GetDbContext();
            var service = new CategoryService(context);

            // Act
            var result = service.Create(new CategoryDto { Name = "Electronics" });

            // Assert
            Assert.Equal("Electronics", result.Name);
            Assert.Single(context.Categories);
        }

        [Fact]
        public void Delete_Throws_WhenCategoryHasProducts()
        {
            var context = GetDbContext();
            var service = new CategoryService(context);

            var category = service.Create(new CategoryDto { Name = "Books" });
            context.Products.Add(new() { Name = "Book", Price = 10, CategoryId = category.Id });
            context.SaveChanges();

            Assert.Throws<InvalidOperationException>(() =>
                service.Delete(category.Id)
            );
        }

        // delete non existing category
        [Fact]
        public void Delete_Throws_WhenCategoryNotFound()
        {
            var context = GetDbContext();
            var service = new CategoryService(context);

            Assert.Throws<KeyNotFoundException>(() =>
                service.Delete(999)
            );
        }

        // get all returns a list
        [Fact]
        public void GetAll_ReturnsCategories()
        {
            var context = GetDbContext();
            var service = new CategoryService(context);

            service.Create(new CategoryDto { Name = "Books" });
            service.Create(new CategoryDto { Name = "Electronics" });

            var result = service.GetAll();

            Assert.Equal(2, result.Count);
        }

        //update category works successfully
        [Fact]
        public void Update_ChangesCategoryName()
        {
            var context = GetDbContext();
            var service = new CategoryService(context);

            var category = service.Create(new CategoryDto { Name = "OldName" });

            service.Update(category.Id, new CategoryDto { Name = "NewName" });

            var updated = context.Categories.Find(category.Id);
            Assert.Equal("NewName", updated!.Name);
        }



    }
}
