using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace DeliveryAPI.Data.Models
{
    [Table("Categories")]
    [Index(nameof(Name))]
    [Index(nameof(Img))]
    public class Category
    {
        [Required]
        [Key]
        public int Id { get; set; }
        public string Name { get; set; } = null!;

        public string Img { get; set; } = null!;

        [JsonIgnore]
        public ICollection<Restaurant>? Restaurants { get; set; } = null!;
    }
}
