using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace DeliveryAPI.Data.RegAndAuth
{
    public class MustBeOwnerHandler : AuthorizationHandler<MustBeOwnerRequirement>
    {
        //Now we can access request information.
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly ApplicationDbContext _dbContext;
      
        public MustBeOwnerHandler(IHttpContextAccessor httpContextAccessor,
            ApplicationDbContext dbContext)
        {
            _httpContextAccessor = httpContextAccessor;
            _dbContext = dbContext;
           
        }
        protected override async Task HandleRequirementAsync(AuthorizationHandlerContext context, 
                                                          MustBeOwnerRequirement requirement
                                                          )
        {
            //Getting query parameter id value.
            var requestId = _httpContextAccessor.HttpContext!.Request.Query["id"];
           
            int requestIdAsInt = Convert.ToInt32(requestId);

            //Getting auth user nick name.
            string owner = context.User.FindFirst(ClaimTypes.Name)!.Value;
            //OR as alternative
            //var userName = _httpContextAccessor.HttpContext.User.Identity.Name;

            var restaurant = await _dbContext.Restaurants.FindAsync(requestIdAsInt);

            if (restaurant == null)
            {
                //let it through so the controller can return a 404.
                context.Succeed(requirement);
                return;
            }

            //If this restaurant/product is not
            // of specific(Authenticated) user(owner).
            //return 403
            if (restaurant.Owner!= owner)
            {
                context.Fail();
                return;
            }
            context.Succeed(requirement);
        }
    }
}
