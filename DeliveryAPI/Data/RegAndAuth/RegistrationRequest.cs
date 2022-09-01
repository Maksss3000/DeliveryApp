using System.ComponentModel.DataAnnotations;

namespace DeliveryAPI.Data.RegAndAuth
{
    public class RegistrationRequest
    {
        [Required(ErrorMessage = "NickName is required.")]
        public string NickName { get; set; } = null!;

        [Required(ErrorMessage = "Password is required.")]
        public string Password { get; set; } = null!;

        [Required(ErrorMessage = "FullName is required.")]
        public string FullName { get; set; } = null!;

        [Required(ErrorMessage = "Address is required.")]
        public string Address { get; set; } = null!;

        [Required(ErrorMessage = "Phone Number is required.")]
        public string Phone { get; set; } = null!;

    }
}
