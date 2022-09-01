using DeliveryAPI.Data;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace DeliveryAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController :ControllerBase
    {

        private readonly ApplicationDbContext _context;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly UserManager<ApplicationUser> _userManager;

        public AccountController(ApplicationDbContext context, RoleManager<IdentityRole> roleManager, UserManager<ApplicationUser> userManager)
        {
            _context = context;
            _roleManager = roleManager;
            _userManager = userManager;
        }

        [HttpPost]
        public async Task<ActionResult> RegisterUser()
        {
            
        }
    }
}
