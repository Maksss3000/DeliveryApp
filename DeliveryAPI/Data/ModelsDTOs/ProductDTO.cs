namespace DeliveryAPI.Data.ModelsDTOs
{
    public class ProductDTO
    {
        public int Id { get; set; }

        public string Name { get; set; } = null!;

        public decimal Price { get; set; }

        public string Description { get; set; } = null!;

        public IFormFile ImageFile { get; set; } = null!;
        public string Image{ get; set; } = null!;

        public string? RestaurantName { get; set; }
        public int RestaurantId { get; set; }

        public string? Owner { get; set; }
    }
}
