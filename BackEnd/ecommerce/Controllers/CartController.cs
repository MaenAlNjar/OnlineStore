using ecommerce.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ecommerce.Controllers
{
    public class CartController : Controller
    {
        private readonly AppDbContext _context;
        public CartController(AppDbContext context)
        {
            _context = context;
        }
        [HttpPost("add-to-cart")]
        public async Task<IActionResult> AddToCart(int productId, string userId)
        {
            try
            {
                // Check if the user already has a cart
                var cart = await _context.Carts
                    .Include(c => c.CartItems)
                    .FirstOrDefaultAsync(c => c.UserId == userId);

                if (cart == null)
                {
                    // Create a new cart for the user
                    cart = new Cart { UserId = userId, CartItems = new List<CartItem>() };
                    _context.Carts.Add(cart);
                    await _context.SaveChangesAsync();
                }

                // Check if the product is already in the cart
                var cartItem = cart.CartItems.FirstOrDefault(ci => ci.ProductId == productId);
                if (cartItem != null)
                {
                    return BadRequest(new { success = false, message = "Product is already in the cart." });
                }

                // ✅ Add the product with a default quantity of 1 (without incrementing)
                cartItem = new CartItem { ProductId = productId, CartId = cart.Id, Quantity = 1 };
                cart.CartItems.Add(cartItem);

                await _context.SaveChangesAsync();

                return Ok(new
                {
                    success = true,
                    message = "Product added to cart.",
                    cart = new
                    {
                        cart.Id,
                        cart.UserId,
                        items = cart.CartItems.Select(ci => new
                        {
                            ci.ProductId,
                            ci.Quantity
                        })
                    }
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "An error occurred.", error = ex.Message });
            }
        }


        [HttpGet("user-cart/{userId}")]
        public async Task<IActionResult> GetUserCart(string userId)
        {
            try
            {
                // Fetch the cart for the specified user
                var cart = await _context.Carts
                    .Include(c => c.CartItems)
                    .ThenInclude(ci => ci.Product) // Include Product for each CartItem
                    .FirstOrDefaultAsync(c => c.UserId == userId);

                if (cart == null)
                {
                    return NotFound(new
                    {
                        success = false,
                        message = "Cart not found for the user."
                    });
                }

                // Return cart details
                return Ok(new
                {
                    success = true,
                    cart = new
                    {
                        cart.Id,
                        cart.UserId,
                        Products = cart.CartItems.Select(cp => new
                        {
                            cp.Product.Id,
                            cp.Product.Name,
                            cp.Product.Price,
                            cp.Product.Description,
                            cp.Product.Image,
                            Quantity = cp.Quantity // ✅ Added this line to include quantity
                        }).ToList()
                    }
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    message = "An error occurred while retrieving the cart.",
                    error = ex.Message
                });
            }
        }

        [HttpGet("{userId}")]
        public async Task<IActionResult> GetCart(string userId)
        {
            var cart = await _context.Carts
                .Include(c => c.CartItems)
                .ThenInclude(ci => ci.Product)
                .FirstOrDefaultAsync(c => c.UserId == userId);

            if (cart == null)
                return NotFound(new { success = false, message = "Cart not found." });

            return Ok(new
            {
                success = true,
                items = cart.CartItems.Select(ci => new
                {
                    ci.ProductId,
                    ci.Product.Name,
                    ci.Product.ImageUrl,
                    ci.Quantity,
                    ci.Product.Price
                })
            });
        }





        [HttpPut("cart/update")]
        public async Task<IActionResult> UpdateQuantity(int productId, string userId, int quantity)
        {
            var cartItem = await _context.CartItems
                .FirstOrDefaultAsync(ci => ci.ProductId == productId && ci.Cart.UserId == userId);

            if (cartItem == null)
                return NotFound(new { success = false, message = "Item not found in cart." });

            cartItem.Quantity = quantity;
            await _context.SaveChangesAsync();

            return await GetCart(userId);
        }

        [HttpDelete("cart/remove")]
        public async Task<IActionResult> RemoveFromCart(int productId, string userId)
        {
            var cartItem = await _context.CartItems
                .FirstOrDefaultAsync(ci => ci.ProductId == productId && ci.Cart.UserId == userId);

            if (cartItem == null)
                return NotFound(new { success = false, message = "Item not found in cart." });

            _context.CartItems.Remove(cartItem);
            await _context.SaveChangesAsync();

            return await GetCart(userId);
        }


    }
}
