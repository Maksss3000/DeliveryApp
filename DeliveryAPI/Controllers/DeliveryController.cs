using DeliveryAPI.Data;
using DeliveryAPI.Data.Models;
using DeliveryAPI.Data.ModelsDTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

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

        private readonly IHttpContextAccessor _httpContextAccessor;
        //private readonly AuthorizationHandlerContext _ctx;
        public DeliveryController(ILogger<DeliveryController> logger,ApplicationDbContext context, IWebHostEnvironment hostingEnvironment,
           IHttpContextAccessor httpContextAccessor)
        {
            _logger = logger;
            _context = context;
            _hostingEnvironment = hostingEnvironment;

            _httpContextAccessor = httpContextAccessor;
           
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
        //Getting Restaurants by their Category.
        public async Task<ActionResult<IEnumerable<Restaurant>>> GetRestaurants(int id=0)
        {
          
            //Return List Of Restaurants
            if (id == 0)
            {
                return await _context.Restaurants.AsNoTracking().ToListAsync();
            }
            //Return Restaurant with specific category.
            else
            {
                return await _context.Restaurants.AsNoTracking().Where(r => r.CategoryId == id).ToListAsync();
            }
          
        }

        
        [HttpGet]
        [Route("ownerRestaurants")]
        public async Task<ActionResult<IEnumerable<Restaurant>>> GetRestaurantsByOwner()
        {
            var userName = _httpContextAccessor.HttpContext!.User.Identity!.Name;
            string owner = userName!.ToString();
            if (string.IsNullOrEmpty(owner))
            {
                return Unauthorized();
            }
            return await _context.Restaurants.AsNoTracking().Where(r => r.Owner == owner).ToListAsync();
            
        }

        [HttpGet]
        [Route("restaurant/{id}")]
        public async Task<ActionResult<RestaurantDTO>> GetRestaurant(int id)
        {
            if (_context.Restaurants == null)
            {
                return NotFound();
            }

            //Checking if we have this Restaurant in DB.
            //If not , returning null.
            if (! await _context.Restaurants.AnyAsync(r => r.Id == id))
            {
                return Ok(null);
            }

            var restaurant = await _context.Restaurants.Include(r => r.Category).Where(r=>r.Id==id).FirstAsync();
            //var res = await _context.Restaurants.Include(c => c.Category).Where(r => r.Id == id)

          
            
            return new RestaurantDTO
            {
                Name = restaurant.Name,
                CategoryId=restaurant.CategoryId,
                Owner = restaurant.Owner,
                Image=restaurant.Image
            };
        }

        [HttpGet]
        [Route("product/{id}")]
        public async Task<ActionResult<ProductDTO>> GetProduct(int id)
        {
            if (_context.Products == null)
            {
                return NotFound();
            }

            //Checking if we have this Product in DB.
            //If not , returning null.
            if (!await _context.Products.AnyAsync(p=> p.Id == id))
            {
                return Ok(null);
            }

            var product = await _context.Products.FindAsync(id);
            var owner = await _context.Restaurants.FindAsync(product!.RestaurantId);

            return new ProductDTO
            {
                Name = product!.Name,
                Price = product.Price,
                Description = product.Description,
                RestaurantId = product.RestaurantId,
                Owner = owner!.Owner
                };
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
               Image=p.Image,
               Price=p.Price,
               RestaurantName=p.Restaurant!.Name

            }).ToListAsync();
        }

        [HttpPost]
        [DisableRequestSizeLimit]
        [Route("addProd")]
        [Authorize(Roles="RegisteredUser")]
        public async Task<IActionResult> AddProductAsync([FromForm] ProductDTO product)
        {
            try
            {
                //Save Image.
                string webRootPath = _hostingEnvironment.WebRootPath;
                string folder = "Products";
                await FileSaver.SaveFileAsync(webRootPath, folder, product.ImageFile);


                await _context.Products.AddAsync(new Product
                {
                    Name = product.Name,
                    Price = product.Price,
                    Description = product.Description,
                    Image = product.Image,
                    RestaurantId=product.RestaurantId,
                    
                });
                await _context.SaveChangesAsync();
              

                return Ok(product);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Upload failed: " + ex.Message);
            }
        }
       
        [HttpPost]
        [DisableRequestSizeLimit]
        [Route("addRest")]
        [Authorize(Roles = "RegisteredUser")]
        public async Task<IActionResult> AddRestaurantAsync([FromForm] RestaurantDTO restaurant)
        {
            try
            {
               
                //Save Image.
                string webRootPath = _hostingEnvironment.WebRootPath;
                string folder = "Restaurants";
                await FileSaver.SaveFileAsync(webRootPath,folder,restaurant.ImageFile);

                var userName = _httpContextAccessor.HttpContext!.User.Identity!.Name;
                string owner = userName!.ToString();
                if (string.IsNullOrEmpty(owner))
                {
                    return Unauthorized();
                }

                await _context.Restaurants.AddAsync(new Restaurant
                {
                    Image=restaurant.Image,
                    CategoryId=restaurant.CategoryId,
                    Name=restaurant.Name,
                    Owner=owner

                });
                await _context.SaveChangesAsync();
              
                return Ok(restaurant);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Upload failed: " + ex.Message);
            }
        }
        
        [HttpPut]
        [DisableRequestSizeLimit]
        [Route("editProd")]
        [Authorize(Roles="RegisteredUser", Policy = "MustBeRestaurantOwner")]
        public async Task<IActionResult> EditProductAsync([FromForm] ProductDTO product,int id)
        {
 
            
            var oldProd = await _context.Products.FindAsync(id);
            if (oldProd != null)
            {
                oldProd.Name = product.Name;
                oldProd.Description = product.Description;
                oldProd.RestaurantId = product.RestaurantId;
                oldProd.Price=product.Price;
                oldProd.Image = product.Image;
               

                await _context.SaveChangesAsync();

                //Save Image.
                string webRootPath = _hostingEnvironment.WebRootPath;
                await FileSaver.SaveFileAsync(webRootPath, "Products", product.ImageFile);

                return Ok(oldProd);
            }

            else
            {
                return BadRequest();
            }
        }

        [HttpPut]
        [DisableRequestSizeLimit]
        [Route("editRest")]
        [Authorize(Roles="RegisteredUser", Policy = "MustBeRestaurantOwner")]
        public async Task<IActionResult> EditRestaurantAsync([FromForm] RestaurantDTO restaurant,int id)
        {

            var oldRest = await _context.Restaurants.FindAsync(id);
            if (oldRest != null)
            {
                oldRest.Name = restaurant.Name;
                oldRest.CategoryId = restaurant.CategoryId;
                oldRest.Image = restaurant.Image;
               
                await _context.SaveChangesAsync();

                //Save Image.
                string webRootPath = _hostingEnvironment.WebRootPath;
                await FileSaver.SaveFileAsync(webRootPath, "Restaurants",restaurant.ImageFile);

                return Ok(oldRest);
            }

            else
            {
                return NotFound();
                //return BadRequest();
            }
            //await _context.Restaurants.Update(restaurant);
        }


        [HttpDelete]
        [Route("deleteRest")]
        [Authorize(Roles = "RegisteredUser", Policy = "MustBeRestaurantOwner")]
        public async Task<IActionResult> DeleteRestaurantAsync(int id)
        {
            var restaurant = await _context.Restaurants.FindAsync(id);
            if (restaurant != null)
            {
                _context.Restaurants.Remove(restaurant);
                await _context.SaveChangesAsync();
                return NoContent();
            }
            return NotFound();
        }

        [HttpDelete]
        [Route("deleteProd")]
        [Authorize(Roles = "RegisteredUser", Policy = "MustBeRestaurantOwner")]
        public async Task<IActionResult> DeleteProductAsync(int id)
        {
            var product = await _context.Products.FindAsync(id);
            if (product != null)
            {
                _context.Products.Remove(product);
                await _context.SaveChangesAsync();
                return NoContent();
            }

            return NotFound();
        }
    }

}