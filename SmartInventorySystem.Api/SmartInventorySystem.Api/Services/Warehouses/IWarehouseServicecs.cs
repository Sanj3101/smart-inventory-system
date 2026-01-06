using SmartInventorySystem.Api.Models.DTOs;
using SmartInventorySystem.Api.Models.DTOs.Warehouse;

namespace SmartInventorySystem.Api.Services.Warehouses
{
    public interface IWarehouseService
    {
        object Create(CreateWarehouseDto dto);
        List<object> GetAll();
        void AssignProductToWarehouse(WarehouseProductDto dto);
        List<object> GetWarehouseStock(int warehouseId);
    }
}
