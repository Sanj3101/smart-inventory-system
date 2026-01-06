using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SmartInventorySystem.Api.Models.DTOs;
using SmartInventorySystem.Api.Services.Products;

namespace SmartInventorySystem.Api.Controllers
{
    [ApiController]
    [Route("api/products")]
    public class ProductsController(IProductService productService) : ControllerBase
    {
        private readonly IProductService _productService = productService;

        // Anyone logged in can view products
        [Authorize]
        [HttpGet]
        public IActionResult GetAll()
        {
            var isAdmin = User.IsInRole("Admin");
            return Ok(_productService.GetAll(isAdmin));
        }

        // only Admin creates product
        [Authorize(Roles = "Admin")]
        [HttpPost]
        public IActionResult Create(ProductDto dto)
        {
            try
            {
                return Ok(_productService.Create(dto));
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("{id}")]
        public IActionResult Update(int id, UpdateProductDto dto)
        {
            try
            {
                _productService.Update(id, dto);
                return Ok(new { message = "Product updated successfully" });
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("{id}/deactivate")]
        public IActionResult Deactivate(int id)
        {
            try
            {
                _productService.Deactivate(id);
                return Ok(new { message = "Product deactivated successfully" });
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("{id}/reactivate")]
        public IActionResult Reactivate(int id)
        {
            try
            {
                _productService.Reactivate(id);
                return Ok(new { message = "Product reactivated successfully" });
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
