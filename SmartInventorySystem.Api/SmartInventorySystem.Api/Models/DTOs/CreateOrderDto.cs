namespace SmartInventorySystem.Api.Models.DTOs
{
    public class CreateOrderDto
    {
        public string? CustomerEmail { get; set; }
        public List<CreateOrderItemDto> Items { get; set; }
    }

    public class CreateOrderItemDto
    {
        public int ProductId { get; set; }
        public int Quantity { get; set; }
    }
}
