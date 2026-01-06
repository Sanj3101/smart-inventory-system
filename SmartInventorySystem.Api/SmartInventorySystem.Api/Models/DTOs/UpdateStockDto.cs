namespace SmartInventorySystem.Api.Models.DTOs
{
    public class UpdateStockDto
    {
        public int ProductId { get; set; }
        public int NewQuantity { get; set; }
    }
}
