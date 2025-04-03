using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ecommerce.Models;
using System.Linq;
using System.Threading.Tasks;

[ApiController]
public class WishlistController : ControllerBase
{
    private readonly AppDbContext _context;

    public WishlistController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet("wishlist/user-wishlist")]
    public async Task<IActionResult> GetWishlist(string userId)
    {
        var wishlistItems = await _context.WishList
            .Where(w => w.UserId == userId)
            .Include(w => w.Product)  // Ensure Product details are included
            .ToListAsync();

        return Ok(wishlistItems);
    }


    [HttpPost("wishlist/add")]
    public async Task<IActionResult> AddToWishlist([FromBody] WishList wishlistItem)
    {
        if (wishlistItem == null)
            return BadRequest("Invalid data.");

        // Check if the product is already in the wishlist
        var exists = await _context.WishList
            .AnyAsync(w => w.UserId == wishlistItem.UserId && w.ProductId == wishlistItem.ProductId);

        if (exists)
            return Conflict("Product already in wishlist.");

        _context.WishList.Add(wishlistItem);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetWishlist), new { userId = wishlistItem.UserId }, wishlistItem);
    }

    [HttpDelete("wishlist/remove/{userId}/{productId}")]
    public async Task<IActionResult> RemoveFromWishlist(string userId, int productId)
    {
        var wishlistItem = await _context.WishList
            .FirstOrDefaultAsync(w => w.UserId == userId && w.ProductId == productId);

        if (wishlistItem == null)
            return NotFound("Product not found in wishlist.");

        _context.WishList.Remove(wishlistItem);
        await _context.SaveChangesAsync();

        return NoContent();
    }



    [HttpGet("wishlist/check/{userId}/{productId}")]
    public async Task<IActionResult> IsProductInWishlist(string userId, int productId)
    {
        var exists = await _context.WishList
            .AnyAsync(w => w.UserId == userId && w.ProductId == productId);

        return Ok(exists);
    }

}
