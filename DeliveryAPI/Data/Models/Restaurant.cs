using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace DeliveryAPI.Data.Models
{
    [Table("Restaurants")]
    [Index(nameof(Name))]
    [Index(nameof(Raiting))]
    [Index(nameof(Votes))]
    [Index(nameof(Image))]
    public class Restaurant
    {
        [Required]
        [Key]
        public int Id { get; set; }

        public string Name { get; set; } = null!;

        public decimal Raiting { get; set; } = 0;

        public int Votes { get; set; } = 0;

        public string Image { get; set; } = null!;

        public string Owner { get; set; } = null!;
        public Category? Category { get; set; } = null!;

        [ForeignKey(nameof(Category))]
        public int CategoryId { get; set; }

        [JsonIgnore]
        public ICollection<Product>? Products { get; set; } = null!;
    }
}
