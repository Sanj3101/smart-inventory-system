namespace SmartInventorySystem.Api.Models.Entities
{
    public class Order
    {
        public int Id { get; set; }

        public string CustomerId { get; set; }
        public ApplicationUser Customer { get; set; }

        public string CreatedById { get; set; }
        public ApplicationUser CreatedBy { get; set; }

        public int WarehouseId { get; set; }
        public Warehouse Warehouse { get; set; }

        public OrderStatus Status { get; set; }

        public DateTime CreatedAt { get; set; }

        public ICollection<OrderItem> OrderItems { get; set; }

        public bool IsPaid { get; set; }

    }
}
