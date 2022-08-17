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

        private readonly IWebHostEnvironment _hostingEnvironment;

        public DeliveryController(ILogger<DeliveryController> logger,ApplicationDbContext context, IWebHostEnvironment hostingEnvironment)
        {
            _logger = logger;
            _context = context;
            _hostingEnvironment = hostingEnvironment;
        }
        [HttpGet]
        [Route("categories")]
        public async Task<ActionResult<IEnumerable<Category>>> GetCategories(bool noImages=false)
        {
            //When we need just Ids ,without Images  Categories.
            if (noImages)
            {
                return await _context.Categories.AsNoTracking().Select(c => new Category
                {
                    Id = c.Id,
                    Name=c.Name
                }).ToListAsync();
            }
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
            /*
            if(!_context.Products.AsNoTracking().Where(p => p.RestaurantId == id).Any())
            {
                List<ProductDTO> emptyList = new List<ProductDTO> { new ProductDTO() };
                
            }
            */
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

        [HttpPost]
        [DisableRequestSizeLimit]
        [Route("editRest")]
        public async Task<IActionResult> EditRestaurant([FromForm] RestaurantDTO restaurant)
        {
            try
            {
                //Save Image.
                string webRootPath = _hostingEnvironment.WebRootPath;
                await FileSaver.SaveFileAsync(webRootPath, restaurant.ImageFile);

              
                await _context.Restaurants.AddAsync(new Restaurant
                {
                    Image=restaurant.Image,
                    CategoryId=restaurant.CategoryId,
                    Name=restaurant.Name,
                    Owner=restaurant.Owner

                });
                await _context.SaveChangesAsync();
                /*
                string location = $"images/{fileName}";

                var result = new
                {
                    message = "Upload successful",
                    url = location
                };
                */

                return Ok(restaurant);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Upload failed: " + ex.Message);
            }
        }
    }
}