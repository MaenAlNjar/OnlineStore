using CloudinaryDotNet;
using ecommerce.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.IO;
using CloudinaryDotNet.Actions;

namespace ecommerce.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class ProductController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly Cloudinary _cloudinary;


        public ProductController(AppDbContext context)
        {
            _context = context;
            _cloudinary = new Cloudinary(new Account(
                "dgsjdx06z",
                "678699932414762",
                "0tCidi0FOLcLo3LE08M1c3Wxvlk"
            ));
        }

        // POST: api/Product
        [HttpPost("create")]
        public async Task<IActionResult> CreateProduct([FromForm] Product product)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new
                {
                    success = false,
                    message = "Validation failed",
                    errors = ModelState.ToDictionary(
                        kvp => kvp.Key,
                        kvp => kvp.Value.Errors.Select(e => e.ErrorMessage).ToArray()
                    )
                });
            }

            if (product.CategoryId == 0)
            {
                return BadRequest(new { success = false, message = "Category is required." });
            }

            try
            {
                // Set default tag to 0 (or null if nullable)
                product.Tag = 0;

                // Handle Cloudinary upload
                if (product.ImageUrl != null)
                {
                    var uploadParams = new ImageUploadParams
                    {
                        File = new FileDescription(product.ImageUrl.FileName, product.ImageUrl.OpenReadStream()),
                        Folder = "ecommerce/products"
                    };

                    var uploadResult = await _cloudinary.UploadAsync(uploadParams);

                    if (uploadResult.StatusCode != System.Net.HttpStatusCode.OK)
                    {
                        return StatusCode(500, new { success = false, message = "Image upload failed." });
                    }

                    product.Image = uploadResult.SecureUrl.ToString();
                }

                // Check if the category exists
                var category = await _context.Categories.FindAsync(product.CategoryId);
                if (category == null)
                {
                    return BadRequest(new { success = false, message = "Invalid CategoryId." });
                }

                // Clear navigation property before adding
                product.Category = null;

                _context.Products.Add(product);
                await _context.SaveChangesAsync();

                return Ok(new
                {
                    success = true,
                    message = "Product created successfully!",
                    product = new
                    {
                        product.Id,
                        product.Name,
                        product.Description,
                        product.Price,
                        product.Image,
                        product.CategoryId,
                        product.Tag 
                    }
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    message = "An error occurred while creating the product.",
                    error = ex.Message
                });
            }
        }


        [HttpGet("all")]
        public async Task<IActionResult> GetProduct()
        {
            var products = await _context.Products
                .Select(product => new
                {
                    product.Id,
                    product.Name,
                    product.Description,
                    product.Price,
                    product.Image,
                    product.Tag,
                    Category = product.Category != null ? product.Category.Name : null // If you want category name
                })
                .ToListAsync();

            return Ok(products);
        }




        [HttpPut("update/{id}")]
        public async Task<IActionResult> UpdateProduct([FromRoute] int id, [FromForm] Product updatedProduct)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null)
            {
                return NotFound(new { success = false, message = "Product not found." });
            }

            // ✅ Update only fields that were sent
            product.Name = !string.IsNullOrEmpty(updatedProduct.Name) ? updatedProduct.Name : product.Name;
            product.Description = !string.IsNullOrEmpty(updatedProduct.Description) ? updatedProduct.Description : product.Description;
            product.Price = updatedProduct.Price != 0 ? updatedProduct.Price : product.Price;
            product.CategoryId = updatedProduct.CategoryId != 0 ? updatedProduct.CategoryId : product.CategoryId;
            product.Tag = updatedProduct.Tag !=0 ? updatedProduct.Tag : product.Tag;

            // ✅ Handle Cloudinary Image Upload if the user has uploaded a new image
            if (updatedProduct.ImageUrl != null)
            {
                // If there's an existing image, delete it from Cloudinary
                if (!string.IsNullOrEmpty(product.Image))
                {
                    var publicId = product.Image.Split('/').Last().Split('.').First();
                    await _cloudinary.DestroyAsync(new DeletionParams(publicId));
                }

                // Upload the new image to Cloudinary
                using var stream = updatedProduct.ImageUrl.OpenReadStream();
                var uploadParams = new ImageUploadParams
                {
                    File = new FileDescription(updatedProduct.ImageUrl.FileName, stream),
                    Folder = "ecommerce/products"
                };

                var uploadResult = await _cloudinary.UploadAsync(uploadParams);
                if (uploadResult.StatusCode != System.Net.HttpStatusCode.OK)
                {
                    return StatusCode(500, new { success = false, message = "Image upload failed." });
                }

                product.Image = uploadResult.SecureUrl.ToString();
            }

            // Save changes to the database
            await _context.SaveChangesAsync();

            return Ok(new { success = true, message = "Product updated successfully!", product });
        }


        // ✅ Delete a Product
        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> DeleteProduct(int id)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null)
            {
                return NotFound(new { message = "Product not found" });
            }

            // Delete associated image
            if (!string.IsNullOrEmpty(product.Image))
            {
                var imagePath = Path.Combine("wwwroot", product.Image.TrimStart('/'));
                if (System.IO.File.Exists(imagePath))
                {
                    System.IO.File.Delete(imagePath);
                }
            }

            _context.Products.Remove(product);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Product deleted successfully" });
        }
        [HttpGet("{id}")]
        public async Task<IActionResult> GetProductById(int id)
        {
            var product = await _context.Products.FindAsync(id);

            if (product == null)
            {
                return NotFound(new { success = false, message = "Product not found" });
            }

            return Ok(product);
        }

        [HttpGet("filter")]
        public async Task<IActionResult> FilterProducts([FromQuery] string? name, [FromQuery] int? categoryId)
        {
            var query = _context.Products.AsQueryable();

            if (!string.IsNullOrEmpty(name))
            {
                query = query.Where(p => p.Name.Contains(name));
            }

            if (categoryId.HasValue)
            {
                query = query.Where(p => p.CategoryId == categoryId);
            }

            var products = await query
                .Select(p => new
                {
                    p.Id,
                    p.Name,
                    p.Description,
                    p.Price,
                    p.Image,
                    p.CategoryId
                })
                .ToListAsync();

            if (products.Count == 0)
            {
                return NotFound("No products found matching the criteria.");
            }

            return Ok(products);
        }

        [HttpGet("byCategory")]
        public async Task<ActionResult<IEnumerable<Product>>> GetProductsByCategory([FromQuery] string category)
        {
            if (string.IsNullOrEmpty(category))
            {
                return await _context.Products.Include(p => p.Category).ToListAsync();
            }

            var products = await _context.Products
                .Include(p => p.Category)
                .Where(p => p.Category.Name == category)
                .ToListAsync();

            return Ok(products); // Always return 200 OK with an array (empty if no products)
        }


  


    }
}
