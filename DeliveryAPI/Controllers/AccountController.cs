using DeliveryAPI.Data;
using DeliveryAPI.Data.RegAndAuth;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.IdentityModel.Tokens.Jwt;

namespace DeliveryAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {

        private readonly ApplicationDbContext _context;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly JwtHandler _jwtHandler;
        public AccountController(ApplicationDbContext context,
                                 RoleManager<IdentityRole> roleManager,
                                 UserManager<ApplicationUser> userManager,
                                 JwtHandler jwtHandler)
        {
            _context = context;
            _roleManager = roleManager;
            _userManager = userManager;
            _jwtHandler = jwtHandler;
        }

        [HttpPost]
        [Route("registration")]
        public async Task<ActionResult> UserRegistration(RegistrationRequest regData)
        {
            //Setup the default role name.
            string role_RegisteredUser = "RegisteredUser";
            bool roleExists;
            Response regRes = new Response() { Success=false};
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
                regRes.Message = "User with same nick name already exists,please change it.";
                return Conflict(regRes);
            }

            return Ok(regRes);
        }


        [HttpPost]
        [Route("login")]
        public async Task<ActionResult> Login(Request loginReq)
        {
            var user = await _userManager.FindByNameAsync(loginReq.NickName);
            if (user == null || !await _userManager.CheckPasswordAsync(user, loginReq.Password))
            {
                return Unauthorized(new Response()
                {
                    Success = false,
                    Message = "Invalid Nick Name or Password"
                });
            }
            var secToken = await _jwtHandler.GetTokenAsync(user);

            var jwt = new JwtSecurityTokenHandler().WriteToken(secToken);
            return Ok(new Response()
            {
                Success = true,
                Message = "Login Successfull",
                Token = jwt,
                Owner = user.UserName

            }) ;
        }
        
    }
}