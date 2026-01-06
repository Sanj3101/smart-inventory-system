using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SmartInventorySystem.Api.Models.DTOs;
using SmartInventorySystem.Api.Services.Categories;

namespace SmartInventorySystem.Api.Controllers
{
    [ApiController]
    [Route("api/categories")]
    public class CategoriesController(ICategoryService categoryService) : ControllerBase
    {
        private readonly ICategoryService _categoryService = categoryService;

        // anyone
        [Authorize]
        [HttpGet]
        public IActionResult GetAll()
        {
            return Ok(_categoryService.GetAll());
        }

        // only Admin creates category
        [Authorize(Roles = "Admin")]
        [HttpPost]
        public IActionResult Create(CategoryDto dto)
        {
            var category = _categoryService.Create(dto);
            return Ok(category);
        }

        // delete category, admin only
        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            try
            {
                _categoryService.Delete(id);
                return Ok(new { message = "Category deleted successfully" });
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("{id}")]
        public IActionResult Update(int id, CategoryDto dto)
        {
            try
            {
                var category = _categoryService.Update(id, dto);
                return Ok(category);
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }
        }
    }
}
