using ecommerce.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ecommerce.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class CategoryController : ControllerBase
    {
        private readonly AppDbContext _context;

        public CategoryController(AppDbContext context)
        {
            _context = context;
        }
        [HttpPost("create")]
        public async Task<IActionResult> CreateCategory([FromBody] Category category)
        {
            if (string.IsNullOrEmpty(category.Name))
            {
                return BadRequest(new { success = false, message = "Category name is required" });
            }

            try
            {
                var newCategory = new Category
                {
                    Name = category.Name
                };

                _context.Categories.Add(newCategory);
                await _context.SaveChangesAsync();

                return Ok(new
                {
                    success = true,
                    message = "Category created successfully",
                    data = new { id = newCategory.Id, name = newCategory.Name }
                });
            }
            catch (Exception ex)
            {
                // Log the exception
                return StatusCode(500, new { success = false, message = "An error occurred", error = ex.Message });
            }
        }
        [HttpGet("all")]
        public async Task<IActionResult> GetAllCategoriesWithProducts()
        {
            try
            {
                var categories = await _context.Categories
                    .Include(c => c.Products)
                    .Select(c => new
                    {
                        c.Id,
                        c.Name,
                        Products = c.Products.Select(p => new
                        {
                            p.Id,
                            p.Name,
                            p.Description,
                            p.Price,
                            p.ImageUrl
                        }).ToList()
                    })
                    .ToListAsync();

                return Ok(new
                {
                    success = true,
                    data = categories
                });
            }
            catch (Exception ex)
            {
                // Log the exception
                return StatusCode(500, new { success = false, message = "An error occurred", error = ex.Message });
            }
        }

    }
}
