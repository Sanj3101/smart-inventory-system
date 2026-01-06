using SmartInventorySystem.Api.Models.DTOs;

namespace SmartInventorySystem.Api.Services.Orders
{
    public interface IOrdersService
    {
        Task<object> CreateOrder(CreateOrderDto dto, string currentUserEmail, bool isSalesExec);
        Task CancelOrder(int orderId, string currentUserEmail);
        Task<object> GetOrdersForFinance();
        Task<object> GetInvoice(int orderId, string currentUserEmail, bool isFinance);
        Task ApproveOrder(int orderId, string currentUserEmail);
        Task PackOrder(int orderId, string currentUserEmail);
        Task ShipOrder(int orderId, string currentUserEmail);
        Task DeliverOrder(int orderId, string currentUserEmail);
        Task<object> GetOrdersCreatedByMe(string currentUserEmail);
        Task<object> GetWarehouseOrders(string currentUserEmail);
    }
}
