using DeliveryAPI.Data;
using DeliveryAPI.Data.RegAndAuth;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;
using Microsoft.IdentityModel.Tokens;

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
//Add ASP.NET Core Identity Support.
//Dependency Injection.
builder.Services.AddIdentity<ApplicationUser, IdentityRole>(options =>
{
    //Use It ?
    options.SignIn.RequireConfirmedAccount = true;

    options.Password.RequireDigit = true;
    options.Password.RequireLowercase = true;
    options.Password.RequireUppercase = true;
    options.Password.RequireNonAlphanumeric = true;
    options.Password.RequiredLength = 8;
}).AddEntityFrameworkStores<ApplicationDbContext>();


//Add Authentication services and middlewares.
builder.Services.AddAuthentication(opt =>
{
    opt.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    opt.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        RequireExpirationTime = true,
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = builder.Configuration["JwtSettings:Issuer"],
        ValidAudience = builder.Configuration["JwtSettings:Audience"],
        IssuerSigningKey = new SymmetricSecurityKey
                                (System.Text.Encoding.UTF8.
                                GetBytes(builder.Configuration["JwtSettings:SecurityKey"]))

    };
});

//Added New.
builder.Services.AddHttpClient();

//Added New.
//Adding Authorization.
builder.Services.AddAuthorization(options =>
    options.AddPolicy("MustBeRestaurantOwner", policy =>
              policy.Requirements.Add(new MustBeOwnerRequirement())));
builder.Services.AddScoped<IAuthorizationHandler, MustBeOwnerHandler>();

//Added New.
//Using to access request information.
builder.Services.AddHttpContextAccessor();

builder.Services.AddScoped<JwtHandler>();


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

//for the wwwroot/images folder
string uploadsDir = Path.Combine(app.Environment.WebRootPath, "images");
if (!Directory.Exists(uploadsDir))
    Directory.CreateDirectory(uploadsDir);

app.UseStaticFiles(new StaticFileOptions()
{
    //RequestPath = "/images",
    FileProvider = new PhysicalFileProvider(uploadsDir)
});

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
