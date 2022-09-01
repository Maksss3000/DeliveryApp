using DeliveryAPI.Data;
using DeliveryAPI.Data.RegAndAuth;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace DeliveryAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {

        private readonly ApplicationDbContext _context;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly UserManager<ApplicationUser> _userManager;

        public AccountController(ApplicationDbContext context,
                                 RoleManager<IdentityRole> roleManager,
                                 UserManager<ApplicationUser> userManager)
        {
            _context = context;
            _roleManager = roleManager;
            _userManager = userManager;
        }

        [HttpPost]
        public async Task<ActionResult> UserRegistration(RegistrationRequest regData)
        {
            //Setup the default role name.
            string role_RegisteredUser = "RegisteredUser";
            bool roleExists;
            RegistrationResult regRes = new RegistrationResult();
            ApplicationUser user;


            //Create the default role(if this role does not  exist yet)
            roleExists = await _roleManager.RoleExistsAsync(role_RegisteredUser);
            if (!roleExists)
            {
                await _roleManager.CreateAsync(new IdentityRole(role_RegisteredUser));
            }
            //If we don`t have user with same NickName.
            if (await _userManager.FindByNameAsync(regData.NickName) == null)
            {
                //create a new admin ApplicationUser account
                user = new ApplicationUser()
                {
                    SecurityStamp = Guid.NewGuid().ToString(),

                    UserName = regData.NickName,
                    PhoneNumber = regData.Phone,
                    FullName = regData.FullName,
                    Address = regData.Address

                };

                //Insert user into the DB
                await _userManager.CreateAsync(user, regData.Password);

                //Assign the "RegisteredUser" role to our user.
                await _userManager.AddToRoleAsync(user, role_RegisteredUser);


                //confirm the email and remove lockout
                user.EmailConfirmed = true;
                user.LockoutEnabled = false;

                await _context.SaveChangesAsync();

                regRes.Success = true;

            }

            else
            {
                regRes.Success = false;
                regRes.Message = "User with same NickName already exists,please change it.";

                return Conflict(regRes);
            }

            return Ok(regRes);
        }
    }
}