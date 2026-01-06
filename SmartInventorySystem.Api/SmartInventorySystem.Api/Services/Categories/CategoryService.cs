using Microsoft.EntityFrameworkCore;
using SmartInventorySystem.Api.Data;
using SmartInventorySystem.Api.Models.DTOs;
using SmartInventorySystem.Api.Models.Entities;

namespace SmartInventorySystem.Api.Services.Categories
{
    public class CategoryService(AppDbContext context) : ICategoryService
    {
        private readonly AppDbContext _context = context;

        // ================= GET ALL =================
        public List<Category> GetAll()
        {
            return _context.Categories.ToList();
        }

        // ================= CREATE =================
        public Category Create(CategoryDto dto)
        {
            var category = new Category
            {
                Name = dto.Name
            };

            _context.Categories.Add(category);
            _context.SaveChanges();

            return category;
        }

        // ================= UPDATE =================
        public Category Update(int id, CategoryDto dto)
        {
            var category = _context.Categories.Find(id);

            if (category == null)
                throw new KeyNotFoundException("Category not found");

            category.Name = dto.Name;
            _context.SaveChanges();

            return category;
        }

        // ================= DELETE =================
        public void Delete(int id)
        {
            var category = _context.Categories
                .Include(c => c.Products)
                .FirstOrDefault(c => c.Id == id);

            if (category == null)
                throw new KeyNotFoundException("Category not found");

            if (category.Products.Any())
                throw new InvalidOperationException(
                    "Cannot delete category with assigned products"
                );

            _context.Categories.Remove(category);
            _context.SaveChanges();
        }
    }
}
