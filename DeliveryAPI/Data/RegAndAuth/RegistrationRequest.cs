using System.ComponentModel.DataAnnotations;

namespace DeliveryAPI.Data.RegAndAuth
{
    public class RegistrationRequest :Request
    {
       
        [Required(ErrorMessage = "FullName is required.")]
        public string FullName { get; set; } = null!;

        [Required(ErrorMessage = "Address is required.")]
        public string Address { get; set; } = null!;

        [Required(ErrorMessage = "Phone Number is required.")]
        public string Phone { get; set; } = null!;

    }
}
