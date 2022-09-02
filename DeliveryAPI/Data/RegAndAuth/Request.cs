using System.ComponentModel.DataAnnotations;

namespace DeliveryAPI.Data.RegAndAuth
{
    public class Request
    {
        [Required(ErrorMessage = "NickName is required.")]
        public string NickName { get; set; } = null!;

        [Required(ErrorMessage = "Password is required.")]
        public string Password { get; set; } = null!;
    }
}
