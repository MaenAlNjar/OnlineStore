using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using System.Threading.Tasks;
using ecommerce.Models;

namespace ecommerce.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RolesController : ControllerBase
    {
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly UserManager<IdentityUser> _userManager;

        public RolesController(RoleManager<IdentityRole> roleManager, UserManager<IdentityUser> userManager)
        {
            _roleManager = roleManager;
            _userManager = userManager;
        }

        /// <summary>
        /// Creates a new role (admin/user/etc.).
        /// </summary>
        [HttpPost("create-role")]
        public async Task<IActionResult> CreateRole([FromBody] string roleName)
        {
            if (string.IsNullOrWhiteSpace(roleName))
                return BadRequest(new { success = false, message = "Role name cannot be empty." });

            var roleExists = await _roleManager.RoleExistsAsync(roleName);
            if (roleExists)
                return BadRequest(new { success = false, message = "Role already exists." });

            var result = await _roleManager.CreateAsync(new IdentityRole(roleName));
            if (result.Succeeded)
                return Ok(new { success = true, message = $"Role '{roleName}' created successfully." });

            return BadRequest(result.Errors);
        }
        [HttpPost("assign-role")]
        public async Task<IActionResult> AssignRole([FromBody] AssignRoleModel model)
        {
            var user = await _userManager.FindByIdAsync(model.UserId);
            if (user == null)
                return NotFound(new { success = false, message = "User not found." });

            var roleExists = await _roleManager.RoleExistsAsync(model.RoleName);
            if (!roleExists)
                return BadRequest(new { success = false, message = "Role does not exist." });

            var result = await _userManager.AddToRoleAsync(user, model.RoleName);
            if (result.Succeeded)
                return Ok(new { success = true, message = $"User assigned to role '{model.RoleName}' successfully." });

            return BadRequest(result.Errors);
        }

    }
}
