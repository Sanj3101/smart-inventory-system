namespace SmartInventorySystem.Api.Models.Entities
{
    public class WarehouseProduct
    {
        public int Id { get; set; }
        public int WarehouseId { get; set; }
        public Warehouse Warehouse { get; set; }

        public int ProductId { get; set; }
        public Product Product { get; set; }
        public int StockQuantity { get; set; }
        public int ReservedQuantity { get; set; }
    }
}
