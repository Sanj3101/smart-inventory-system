namespace SmartInventorySystem.Api.Models.DTOs
{
    public class InventoryStatusDto
    {
        public int ProductId { get; set; }
        public string ProductName { get; set; } = string.Empty;
        public int AvailableQuantity { get; set; }
        public string Status { get; set; }
    }

}
