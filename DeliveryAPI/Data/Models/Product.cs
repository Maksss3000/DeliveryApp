using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DeliveryAPI.Data.Models
{
    [Table("Products")]
    [Index(nameof(Name))]
    [Index(nameof(Price))]
    [Index(nameof(Description))]
    [Index(nameof(Image))]
    public class Product
    {
        [Key]
        [Required]
        public int Id { get; set; }

        public string Name { get; set; } = null!;

        public decimal Price { get; set; }

        public string Description { get; set; } = null!;

        public string Image { get; set; } = null!;

        [ForeignKey(nameof(Restaurant))]
        public int RestaurantId { get; set; }

        public Restaurant? Restaurant { get; set; }
    }
}
