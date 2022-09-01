namespace DeliveryAPI.Data.RegAndAuth
{
    public class RegistrationResult
    {
        //True if registration attempt is successful,else False.
        public bool Success { get; set; }

        //Registration attempt result message.
        public string Message { get; set; } = null!;
    }
}
