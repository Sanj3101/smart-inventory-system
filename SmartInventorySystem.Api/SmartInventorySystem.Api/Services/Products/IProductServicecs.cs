using SmartInventorySystem.Api.Models.DTOs;

namespace SmartInventorySystem.Api.Services.Products
{
    public interface IProductService
    {
        object GetAll(bool isAdmin);
        object Create(ProductDto dto);
        void Update(int id, UpdateProductDto dto);
        void Deactivate(int id);
        void Reactivate(int id);
    }
}
