namespace SmartInventorySystem.Api.Models.DTOs
{
    public class SalesByDateDto
    {
        public DateTime Date { get; set; }
        public int TotalQuantity { get; set; }
        public decimal TotalRevenue { get; set; }

        public string Label => Date.ToString("yyyy-MM-dd");
    }
}
