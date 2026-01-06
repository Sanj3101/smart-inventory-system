using SmartInventorySystem.Api.Models.DTOs;

namespace SmartInventorySystem.Api.Services.Reports
{
    public interface IReportsService
    {
        List<SalesByDateDto> GetSalesByDate(DateTime from, DateTime to);
        List<SalesByProductDto> GetSalesByProduct(DateTime from, DateTime to);
        List<InventoryStatusDto> GetInventoryStatus();
        List<TopProductDto> GetTopSellingProducts(int limit);
    }
}
