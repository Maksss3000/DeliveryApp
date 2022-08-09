namespace DeliveryAPI.Data.ModelsDTOs
{
    public class ProductDTO
    {
        public int Id { get; set; }

        public string Name { get; set; } = null!;

        public decimal Price { get; set; }

        public string Description { get; set; } = null!;

        public string Img{ get; set; } = null!;

        public string RestaurantName { get; set; } = null!;
    }
}
