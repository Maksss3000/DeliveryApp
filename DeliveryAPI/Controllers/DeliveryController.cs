using DeliveryAPI.Data;
using DeliveryAPI.Data.Models;
using DeliveryAPI.Data.ModelsDTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DeliveryAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DeliveryController : ControllerBase
    {
        private static readonly string[] Summaries = new[]
        {
        "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
    };

        private readonly ILogger<DeliveryController> _logger;
        private readonly ApplicationDbContext _context;
        public DeliveryController(ILogger<DeliveryController> logger,ApplicationDbContext context)
        {
            _logger = logger;
            _context = context;
        }
        [HttpGet]
        [Route("categories")]
        public async Task<ActionResult<IEnumerable<Category>>> GetCategories()
        {
            return await _context.Categories.AsNoTracking().Select(c => new Category
            {
                Name=c.Name,
                Img= c.Img,
                Id=c.Id
            }).ToListAsync();
        }

        [HttpGet]
        [Route("restaurants/{id}")]
        public async Task<ActionResult<IEnumerable<Restaurant>>> GetRestaurants(int id=0)
        {
            if (id == 0)
            {
                return await _context.Restaurants.AsNoTracking().ToListAsync();
            }
            else
            {
                return await _context.Restaurants.AsNoTracking().Where(r => r.CategoryId == id).ToListAsync();
            }
          
        }

        [HttpGet]
        [Route("products/{id}")]
        public async Task<ActionResult<IEnumerable<ProductDTO>>> GetProducts(int id)
        {
            return await _context.Products.AsNoTracking().Where(p => p.RestaurantId == id).Select(p => new ProductDTO
            {
               Id=p.Id,
               Name=p.Name,
               Description=p.Description,
               Img=p.Image,
               Price=p.Price,
               RestaurantName=p.Restaurant!.Name

            }).ToListAsync();
        }
    }
}