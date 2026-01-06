using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using SmartInventorySystem.Api.Data;
using SmartInventorySystem.Api.Models;
using SmartInventorySystem.Api.Models.Entities;

namespace SmartInventorySystem.Api.Services
{
    public class NotificationService
    {
        private readonly AppDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;

        public NotificationService(
            AppDbContext context,
            UserManager<ApplicationUser> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        public async Task NotifyUser(
            string userId,
            string title,
            string message,
            int? orderId = null,
            int? productId = null)
        {
            _context.Notifications.Add(new Notification
            {
                UserId = userId,
                Title = title,
                Message = message,
                OrderId = orderId,
                ProductId = productId
            });

            await _context.SaveChangesAsync();
        }

        public async Task NotifyUsers(
            IEnumerable<string> userIds,
            string title,
            string message,
            int? orderId = null,
            int? productId = null)
        {
            foreach (var userId in userIds.Distinct())
            {
                _context.Notifications.Add(new Notification
                {
                    UserId = userId,
                    Title = title,
                    Message = message,
                    OrderId = orderId,
                    ProductId = productId
                });
            }

            await _context.SaveChangesAsync();
        }
    }
}
