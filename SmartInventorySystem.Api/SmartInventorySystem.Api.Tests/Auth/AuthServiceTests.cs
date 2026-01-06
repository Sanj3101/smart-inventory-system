using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Moq;
using SmartInventorySystem.Api.Models;
using SmartInventorySystem.Api.Models.DTOs;
using SmartInventorySystem.Api.Services.Auth;
using Xunit;

namespace SmartInventorySystem.Api.Tests.Auth
{
    public class AuthServiceTests
    {
        [Fact]
        public async Task LoginAsync_ReturnsToken_WhenCredentialsValid()
        {
            // Arrange
            var user = new ApplicationUser { Email = "test@test.com" };

            var userManager = MockUserManager();
            userManager
                .Setup(u => u.FindByEmailAsync(user.Email))
                .ReturnsAsync(user);

            userManager
                .Setup(u => u.CheckPasswordAsync(user, It.IsAny<string>()))
                .ReturnsAsync(true);

            userManager
                .Setup(u => u.GetRolesAsync(user))
                .ReturnsAsync(new[] { "Customer" });

            var config = new ConfigurationBuilder()
                .AddInMemoryCollection(new Dictionary<string, string>
                {
                    { "Jwt:Key", "THIS_IS_A_VERY_LONG_TEST_KEY_FOR_UNIT_TESTING_ONLY_123456" },
                    { "Jwt:Issuer", "TestIssuer" },
                    { "Jwt:Audience", "TestAudience" }
                })
                .Build();

            var service = new AuthService(userManager.Object, config);

            // Act
            var result = await service.LoginAsync(
                new LoginDto { Email = user.Email, Password = "Password123!" }
            );

            // Assert
            Assert.False(string.IsNullOrEmpty(result.Token));
            Assert.Equal("Customer", result.Role);
        }

        //invalid passoword
        [Fact]
        public async Task LoginAsync_ThrowsUnauthorized_WhenPasswordInvalid()
        {
            // Arrange
            var user = new ApplicationUser { Email = "test@test.com" };
            var userManager = MockUserManager();

            userManager.Setup(u => u.FindByEmailAsync(user.Email))
                .ReturnsAsync(user);

            userManager.Setup(u => u.CheckPasswordAsync(user, It.IsAny<string>()))
                .ReturnsAsync(false);

            var config = BuildJwtConfig();
            var service = new AuthService(userManager.Object, config);

            // Act & Assert
            await Assert.ThrowsAsync<UnauthorizedAccessException>(() =>
                service.LoginAsync(new LoginDto
                {
                    Email = user.Email,
                    Password = "wrong"
                })
            );
        }

        //user not found
        [Fact]
        public async Task LoginAsync_ThrowsUnauthorized_WhenUserNotFound()
        {
            var userManager = MockUserManager();

            userManager.Setup(u => u.FindByEmailAsync(It.IsAny<string>()))
                .ReturnsAsync((ApplicationUser?)null);

            var config = BuildJwtConfig();
            var service = new AuthService(userManager.Object, config);

            await Assert.ThrowsAsync<UnauthorizedAccessException>(() =>
                service.LoginAsync(new LoginDto
                {
                    Email = "missing@test.com",
                    Password = "Password123!"
                })
            );
        }

        // default role
        [Fact]
        public async Task LoginAsync_DefaultsToCustomer_WhenNoRolesAssigned()
        {
            var user = new ApplicationUser { Email = "test@test.com" };
            var userManager = MockUserManager();

            userManager.Setup(u => u.FindByEmailAsync(user.Email))
                .ReturnsAsync(user);

            userManager.Setup(u => u.CheckPasswordAsync(user, It.IsAny<string>()))
                .ReturnsAsync(true);

            userManager.Setup(u => u.GetRolesAsync(user))
                .ReturnsAsync(new List<string>()); 

            var service = new AuthService(userManager.Object, BuildJwtConfig());

            var result = await service.LoginAsync(new LoginDto
            {
                Email = user.Email,
                Password = "Password123!"
            });

            Assert.Equal("Customer", result.Role);
        }




        //helpers

        private static Mock<UserManager<ApplicationUser>> MockUserManager()
        {
            var store = new Mock<IUserStore<ApplicationUser>>();

            return new Mock<UserManager<ApplicationUser>>(
                store.Object,
                null,   // IPasswordHasher
                null,   // IUserValidator
                null,   // IPasswordValidator
                null,   // ILookupNormalizer
                null,   // IdentityErrorDescriber
                null,   // IServiceProvider
                null,   // ILogger
                null    // IOptions
            );
        }

        private IConfiguration BuildJwtConfig()
        {
            return new ConfigurationBuilder()
                .AddInMemoryCollection(new Dictionary<string, string>
                {
            { "Jwt:Key", "THIS_IS_A_VERY_LONG_TEST_KEY_FOR_UNIT_TESTING_ONLY_123456" },
            { "Jwt:Issuer", "TestIssuer" },
            { "Jwt:Audience", "TestAudience" }
                })
                .Build();
        }


    }
}
