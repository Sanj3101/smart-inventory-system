using Microsoft.EntityFrameworkCore;
using SmartInventorySystem.Api.Data;
using SmartInventorySystem.Api.Models.DTOs;
using SmartInventorySystem.Api.Models.Entities;

namespace SmartInventorySystem.Api.Services.Products
{
    public class ProductService(AppDbContext context) : IProductService
    {
        private readonly AppDbContext _context = context;

        // get all
        public object GetAll(bool isAdmin)
        {
            var query = _context.Products
                .Include(p => p.Category)
                .AsQueryable();

            if (!isAdmin)
            {
                query = query.Where(p => p.IsActive);
            }

            return query
                .Select(p => new
                {
                    p.Id,
                    p.Name,
                    p.Price,
                    p.CategoryId,
                    Category = p.Category.Name,
                    p.IsActive
                })
                .ToList();
        }


        // create by admin
        public object Create(ProductDto dto)
        {
            var categoryExists = _context.Categories.Any(c => c.Id == dto.CategoryId);
            if (!categoryExists)
                throw new InvalidOperationException("Invalid category selected");

            var product = new Product
            {
                Name = dto.Name,
                Price = dto.Price,
                CategoryId = dto.CategoryId
            };

            _context.Products.Add(product);
            _context.SaveChanges();

            return new
            {
                product.Id,
                product.Name,
                product.Price,
                product.CategoryId
            };
        }


        // update by admin
        public void Update(int id, UpdateProductDto dto)
        {
            var product = _context.Products.Find(id);
            if (product == null)
                throw new KeyNotFoundException();

            var categoryExists = _context.Categories.Any(c => c.Id == dto.CategoryId);
            if (!categoryExists)
                throw new InvalidOperationException("Invalid category selected");

            product.Name = dto.Name;
            product.Price = dto.Price;
            product.CategoryId = dto.CategoryId;
            product.IsActive = dto.IsActive;

            _context.SaveChanges();
        }

        //de activate by admin
        public void Deactivate(int id)
        {
            var product = _context.Products.Find(id);
            if (product == null)
                throw new KeyNotFoundException();

            if (!product.IsActive)
                throw new InvalidOperationException("Product is already inactive");

            product.IsActive = false;
            _context.SaveChanges();
        }


        // activate by admin
        public void Reactivate(int id)
        {
            var product = _context.Products.Find(id);
            if (product == null)
                throw new KeyNotFoundException();

            if (product.IsActive)
                throw new InvalidOperationException("Product is already active");

            product.IsActive = true;
            _context.SaveChanges();
        }
    }
}
