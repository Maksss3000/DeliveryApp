using DeliveryAPI.Data;
using DeliveryAPI.Data.Models;
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
            }).ToListAsync();
        }

        [HttpGet]
        [Route("restaurants")]
        public async Task<ActionResult<IEnumerable<Restaurant>>> GetRestaurants()
        {
            return await _context.Restaurants.AsNoTracking().ToListAsync();
        }
    }
}