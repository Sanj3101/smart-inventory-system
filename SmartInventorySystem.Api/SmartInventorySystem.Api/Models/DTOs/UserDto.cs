namespace SmartInventorySystem.Api.Models.DTOs
{
    public class UserDto
    {
        public string Id { get; set; }
        public string Email { get; set; }
        public string Role { get; set; }
        public int? WarehouseId { get; set; }
    }
}
