using SmartInventorySystem.Api.Models.DTOs;

namespace SmartInventorySystem.Api.Services.WarehosueManager
{
    public interface IWarehouseManagerService
    {
        Task<object> GetMyWarehouseAsync(string currentUserEmail);
        Task<object> GetStockAsync(string currentUserEmail);
        Task UpdateStockAsync(string currentUserEmail, UpdateStockDto dto);
    }
}
