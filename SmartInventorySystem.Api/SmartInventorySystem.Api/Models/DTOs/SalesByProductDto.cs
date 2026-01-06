namespace SmartInventorySystem.Api.Models.DTOs
{
    public class SalesByProductDto
    {
        public string ProductName { get; set; } = string.Empty;
        public int TotalQuantity { get; set; }
        public decimal TotalRevenue { get; set; }
    }

}
