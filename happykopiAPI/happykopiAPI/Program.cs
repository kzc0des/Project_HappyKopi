using happykopiAPI.Data;
using happykopiAPI.Hubs;
using happykopiAPI.Services.Implementations;
using happykopiAPI.Services.Interfaces;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);
var AllowSpecificOrigins = "_allowSpecificOrigins";

builder.WebHost.ConfigureKestrel(options =>
{
    options.ListenAnyIP(5000); 
    options.ListenAnyIP(5001, listenOptions =>
    {
        listenOptions.UseHttps();
    });
});

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddDbContext<HappyKopiDbContext>(options => options.UseSqlServer(builder.Configuration.GetConnectionString("LocalDB"), sqlServerOptionsAction: sqlOptions =>
{
    sqlOptions.EnableRetryOnFailure();
})
.LogTo(Console.WriteLine, LogLevel.Information) 
.EnableSensitiveDataLogging());

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
       options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"])),
            ValidateIssuer = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidateAudience = false
        };
    });

builder.Services.AddSignalR();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IStockItemService, StockItemService>();
builder.Services.AddScoped<IModifierService, ModifierService>();
builder.Services.AddScoped<INotificationService, SignalRNotificationService>();

builder.Services.AddCors(options =>
{
    options.AddPolicy(name: AllowSpecificOrigins,
        policy =>
        {
            policy.WithOrigins("http://localhost:4200", "http://192.168.1.14:4200")
                  .AllowAnyHeader()
                  .AllowAnyMethod()
                  .AllowCredentials();
        });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

//app.UseHttpsRedirection();

app.UseCors(AllowSpecificOrigins);

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.MapHub<UpdateHub>("/api/updateHub");

app.Run();
