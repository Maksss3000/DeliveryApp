using Microsoft.AspNetCore.Identity;

namespace DeliveryAPI.Data
{
    public class ApplicationUser : IdentityUser
    {
        public string FullName { get; set; } = null!;

        public string Address { get; set; } = null!;

        
    }
}
