using System.ComponentModel.DataAnnotations;

namespace DeliveryAPI.Data.ModelsDTOs
{
    public class RestaurantDTO
    {

        public IFormFile ImageFile { get; set; } = null!;

        public string Image { get; set; } = null!;

        public string Name { get; set; } = null!;

        public decimal Raiting { get; set; } = 0;

        public int Votes { get; set; } = 0;

        public string Owner { get; set; } = null!;
        public int CategoryId { get; set; }
    }
}
