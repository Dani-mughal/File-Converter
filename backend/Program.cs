using ConvertHub.Api.Middleware;
using ConvertHub.Api.Services.Implementation;
using ConvertHub.Api.Services.Interfaces;
using Microsoft.AspNetCore.Http.Features;

var builder = WebApplication.CreateBuilder(args);

// Logging
builder.Logging.ClearProviders();
builder.Logging.AddConsole();
builder.Logging.SetMinimumLevel(LogLevel.Debug);
 
// Configure FFmpeg Path
var ffmpegPath = builder.Configuration["FfmpegPath"];
if (!string.IsNullOrEmpty(ffmpegPath))
{
    var currentPath = Environment.GetEnvironmentVariable("PATH") ?? "";
    if (!currentPath.Contains(ffmpegPath))
    {
        Environment.SetEnvironmentVariable("PATH", $"{ffmpegPath};{currentPath}");
    }
}

// Add services to the container
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

// Dependency Injection
builder.Services.AddSingleton<JobManager>();
builder.Services.AddScoped<IFileStorageService, FileStorageService>();
builder.Services.AddScoped<PdfConversionService>();
builder.Services.AddScoped<ImageConversionService>();
builder.Services.AddScoped<MediaConversionService>();
builder.Services.AddScoped<TextDataConversionService>();
builder.Services.AddScoped<IConversionFactory, ConversionFactory>();
builder.Services.AddScoped<IConversionService, PdfConversionService>();

// Configure upload limits (200MB)
builder.Services.Configure<FormOptions>(options =>
{
    options.MultipartBodyLengthLimit = 209715200;
});

// CORS — allow all origins
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

// Create temp directories on startup
var tempDir = Path.Combine(app.Environment.ContentRootPath, "TempUploads");
var outputDir = Path.Combine(tempDir, "output");
Directory.CreateDirectory(tempDir);
Directory.CreateDirectory(outputDir);

app.Logger.LogInformation("ConvertHub API starting. TempDir={TempDir}", tempDir);

// CORRECT middleware order: CORS → Routing → Exception Handler → Endpoints
app.UseCors("AllowAll");
app.UseRouting();
app.UseExceptionHandling();
app.MapControllers();

// Root health check
app.MapGet("/", () => Results.Ok(new { status = "online", service = "ConvertHub API", time = DateTime.UtcNow }));

var port = Environment.GetEnvironmentVariable("PORT") ?? "8080";
app.Logger.LogInformation("Listening on port {Port}", port);
app.Run($"http://0.0.0.0:{port}");
