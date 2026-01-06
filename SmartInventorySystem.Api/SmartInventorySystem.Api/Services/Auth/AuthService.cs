using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using SmartInventorySystem.Api.Models;
using SmartInventorySystem.Api.Models.DTOs;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace SmartInventorySystem.Api.Services.Auth
{
    public class AuthService(
        UserManager<ApplicationUser> userManager,
        IConfiguration config
    ) : IAuthService
    {
        private readonly UserManager<ApplicationUser> _userManager = userManager;
        private readonly IConfiguration _config = config;

        // ================= REGISTER =================
        public async Task RegisterAsync(RegisterDto dto)
        {
            var user = new ApplicationUser
            {
                UserName = dto.Email,
                Email = dto.Email
            };

            var result = await _userManager.CreateAsync(user, dto.Password);

            if (!result.Succeeded)
                throw new ApplicationException(
                    string.Join(", ", result.Errors.Select(e => e.Description))
                );

            // Default role
            await _userManager.AddToRoleAsync(user, "Customer");
        }

        // ================= LOGIN =================
        public async Task<(string Token, string Role)> LoginAsync(LoginDto dto)
        {
            var user = await _userManager.FindByEmailAsync(dto.Email)
                ?? throw new UnauthorizedAccessException("Invalid credentials");

            if (!await _userManager.CheckPasswordAsync(user, dto.Password))
                throw new UnauthorizedAccessException("Invalid credentials");

            var roles = await _userManager.GetRolesAsync(user);
            var role = roles.FirstOrDefault() ?? "Customer";

            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, user.Email!),
                new Claim(ClaimTypes.Role, role),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            var key = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(_config["Jwt:Key"]!)
            );

            var token = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"],
                audience: _config["Jwt:Audience"],
                expires: DateTime.UtcNow.AddHours(2),
                claims: claims,
                signingCredentials: new SigningCredentials(
                    key,
                    SecurityAlgorithms.HmacSha256
                )
            );

            return (
                new JwtSecurityTokenHandler().WriteToken(token),
                role
            );
        }
    }
}
