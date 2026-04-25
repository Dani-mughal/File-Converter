using ConvertHub.Api.Middleware;
using ConvertHub.Api.Services.Implementation;
using ConvertHub.Api.Services.Interfaces;
using Microsoft.AspNetCore.Http.Features;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

// Dependency Injection
builder.Services.AddScoped<IFileStorageService, FileStorageService>();
builder.Services.AddScoped<IConversionService, PdfConversionService>();

// Configure limits (100MB for multiple files)
builder.Services.Configure<FormOptions>(options =>
{
    options.MultipartBodyLengthLimit = 104857600; 
});

// Configure CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        policy =>
        {
            policy.AllowAnyOrigin()
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});

var app = builder.Build();

// Initialize Temp Directory
var tempDir = Path.Combine(app.Environment.ContentRootPath, "TempUploads");
if (!Directory.Exists(tempDir))
{
    Directory.CreateDirectory(tempDir);
}

app.UseExceptionHandling();
app.UseCors("AllowAll");

app.MapControllers();

// Use dynamic port for Render
var port = Environment.GetEnvironmentVariable("PORT") ?? "5000";
app.Run($"http://0.0.0.0:{port}");
