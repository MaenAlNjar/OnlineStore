using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using static ecommerce.ViewModels.Auth;
namespace ecommerce.Controllers
{
    public class AuthController : Controller
    {
        private readonly UserManager<IdentityUser> _userManager;
        private readonly SignInManager<IdentityUser> _signInManager;

        public AuthController(UserManager<IdentityUser> userManager, SignInManager<IdentityUser> signInManager)
        {
            _userManager = userManager;
            _signInManager = signInManager;
        }

        // Register a new user
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] ViewModels.Auth.RegisterModel model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var user = new IdentityUser { UserName = model.Email, Email = model.Email };
            var result = await _userManager.CreateAsync(user, model.Password);

            if (!result.Succeeded)
            {
                return BadRequest(result.Errors);
            }

            return Ok("User registered successfully!");
        }

        // Login
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginModel model)
        {
            var user = await _userManager.FindByEmailAsync(model.Email);
            if (user == null)
            {
                return BadRequest(new { success = false, message = "Email not found." });
            }

            var result = await _signInManager.PasswordSignInAsync(user.UserName, model.Password, false, false);
            if (!result.Succeeded)
            {
                return BadRequest(new { success = false, message = "Invalid password." });
            }

            // ✅ Get user roles
            var roles = await _userManager.GetRolesAsync(user);

            var userResponse = new
            {
                Id = user.Id,
                Email = user.Email,
                UserName = user.UserName,
                Roles = roles // Send roles to the frontend
            };

            HttpContext.Session.SetString("UserId", user.Id);

            return Ok(new { success = true, message = "Login successful!", user = userResponse });
        }



    }
}
