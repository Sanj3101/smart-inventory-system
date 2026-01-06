namespace SmartInventorySystem.Api.Models.Entities
{
    public class Warehouse
    {
        public int Id { get; set; }

        public string Name { get; set; }
        public string Location { get; set; }

        public ICollection<WarehouseProduct> WarehouseProducts { get; set; }
        public ICollection<ApplicationUser> WarehouseManagers { get; set; }
    }
}
