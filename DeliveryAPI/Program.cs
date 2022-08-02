using DeliveryAPI.Data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();


//Add ApplicationDbContext and SQL Server support.
//DInjection
builder.Services.AddDbContext<ApplicationDbContext>(options =>
                                                    options.UseSqlServer
                                                    (builder.Configuration.
                                                    GetConnectionString("DefaultConnection")));

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

//To get Static files
//As example from wwwroot folder (images)
 app.UseStaticFiles();

app.UseAuthorization();

app.MapControllers();

app.Run();
