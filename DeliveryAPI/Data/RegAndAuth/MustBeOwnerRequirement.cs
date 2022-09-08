using Microsoft.AspNetCore.Authorization;

namespace DeliveryAPI.Data.RegAndAuth
{
    public class MustBeOwnerRequirement : IAuthorizationRequirement
    {
        public MustBeOwnerRequirement() { }
    }
}
