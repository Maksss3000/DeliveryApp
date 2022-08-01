using DeliveryAPI.Data.Models;
using Microsoft.EntityFrameworkCore;

namespace DeliveryAPI.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext() : base() { }

        public ApplicationDbContext(DbContextOptions options) : base(options) { }

        public DbSet<Category> Categories => Set<Category>();
    }
}
