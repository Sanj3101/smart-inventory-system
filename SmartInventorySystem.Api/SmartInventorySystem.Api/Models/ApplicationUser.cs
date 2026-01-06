using Microsoft.AspNetCore.Identity;
using SmartInventorySystem.Api.Models.Entities;

namespace SmartInventorySystem.Api.Models
{
    public class ApplicationUser : IdentityUser
    {
        public int? WarehouseId { get; set; }
        public Warehouse Warehouse { get; set; }
    }
}
