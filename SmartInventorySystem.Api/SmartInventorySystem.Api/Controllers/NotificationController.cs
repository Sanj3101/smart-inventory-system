using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartInventorySystem.Api.Data;
using SmartInventorySystem.Api.Models;

namespace SmartInventorySystem.Api.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/notifications")]
    public class NotificationsController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;

        public NotificationsController(
            AppDbContext context,
            UserManager<ApplicationUser> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        [HttpGet]
        public async Task<IActionResult> GetMyNotifications()
        {
            var user = await _userManager.FindByEmailAsync(User.Identity!.Name!);

            var notifications = await _context.Notifications
                .Where(n => n.UserId == user!.Id)
                .OrderByDescending(n => n.CreatedAt)
                .ToListAsync();

            return Ok(notifications);
        }

        [HttpGet("unread-count")]
        public async Task<IActionResult> GetUnreadCount()
        {
            var user = await _userManager.FindByEmailAsync(User.Identity!.Name!);

            var count = await _context.Notifications
                .CountAsync(n => n.UserId == user!.Id && !n.IsRead);

            return Ok(new { count });
        }

        [HttpPut("{id}/read")]
        public async Task<IActionResult> MarkRead(int id)
        {
            var user = await _userManager.FindByEmailAsync(User.Identity!.Name!);

            var notif = await _context.Notifications
                .FirstOrDefaultAsync(n => n.Id == id && n.UserId == user!.Id);

            if (notif == null) return NotFound();

            notif.IsRead = true;
            await _context.SaveChangesAsync();

            return Ok();
        }

        [HttpPut("read-all")]
        public async Task<IActionResult> MarkAllRead()
        {
            var user = await _userManager.FindByEmailAsync(User.Identity!.Name!);

            var notifs = await _context.Notifications
                .Where(n => n.UserId == user!.Id && !n.IsRead)
                .ToListAsync();

            notifs.ForEach(n => n.IsRead = true);
            await _context.SaveChangesAsync();

            return Ok();
        }
    }
}
