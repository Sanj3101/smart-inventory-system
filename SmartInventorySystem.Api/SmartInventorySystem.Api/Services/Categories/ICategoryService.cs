using SmartInventorySystem.Api.Models.DTOs;
using SmartInventorySystem.Api.Models.Entities;

namespace SmartInventorySystem.Api.Services.Categories
{
    public interface ICategoryService
    {
        List<Category> GetAll();
        Category Create(CategoryDto dto);
        Category Update(int id, CategoryDto dto);
        void Delete(int id);
    }
}
