using DeliveryAPI.Data;
using DeliveryAPI.Data.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security;

namespace DeliveryAPI.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class SeedController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IWebHostEnvironment _env;

        public SeedController(ApplicationDbContext context,IWebHostEnvironment env)
        {
            _context = context;
            _env=env;
        }


        [HttpGet]
        public async Task<ActionResult> SeedData()
        {
            //Prevent non-development environment from running this method.
            if (!_env.IsDevelopment())
            {
                throw new SecurityException("Not allowed");
            }

            if (!_context.Categories.Any())
            {
              
                Category pizza = new Category { Img = "pizza.jpg", Name = "Pizzas" };
                Category burger = new Category { Img = "burger.jpg", Name = "Burgers" };
                Category sandwich = new Category { Img = "sandwich.jpg", Name = "Sandwiches" };
                Category hotDog = new Category { Img = "hotDog.jpg", Name = "HotDogs" };
                Category other = new Category { Img = "other.jpg", Name = "Other" };

                await _context.Categories!.AddRangeAsync(pizza, burger, sandwich, hotDog,other);

                Restaurant mcD = new Restaurant { Name = "MDonalds", Category = burger, Image = "mc.jpg" };
                Restaurant pizzaStar = new Restaurant { Name = "PizzaStar", Category = pizza, Image = "pizStar.jpg" };
                await _context.Restaurants.AddRangeAsync(mcD, pizzaStar);

                Product cheezeBurger = new Product { Name = "CheezeBurger", Description = "Very Tasty Burger , with Cheeze", Price = 65, Image = "cBurger.jpg", Restaurant = mcD };
                Product extraHotPizza= new Product { Name = "HotPizza", Description = "Very Hot Pizza , with Cheeze", Price = 55, Image = "hotPizza.jpg", Restaurant =pizzaStar };
                await _context.Products.AddRangeAsync(cheezeBurger, extraHotPizza);

                await _context.SaveChangesAsync();
            }
            return Ok(_context.Categories);
        }
    }
}
