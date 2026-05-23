using ConvertHub.Api.Middleware;
using ConvertHub.Api.Services.Implementation;
using ConvertHub.Api.Services.Interfaces;
using Microsoft.AspNetCore.Http.Features;
using SkiaSharp;

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
builder.Services.AddScoped<SvgConversionService>();
builder.Services.AddScoped<MediaConversionService>();
builder.Services.AddScoped<TextDataConversionService>();
builder.Services.AddScoped<ArchiveConversionService>();
builder.Services.AddScoped<IConversionFactory, ConversionFactory>();
builder.Services.AddScoped<IConversionService, PdfConversionService>();
builder.Services.AddScoped<IndexNowService>(); // Add IndexNow Service

// Configure upload limits (512MB)
builder.WebHost.ConfigureKestrel(options =>
{
    options.Limits.MaxRequestBodySize = 536870912; // 512MB
});

builder.Services.Configure<FormOptions>(options =>
{
    options.MultipartBodyLengthLimit = 536870912; // 512MB
    options.ValueLengthLimit = 536870912;
    options.MemoryBufferThreshold = 536870912;
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

// ── Startup Diagnostics ───────────────────────────────────────────────────
// LibreOffice check
var sofficePaths = OperatingSystem.IsWindows()
    ? new[] { @"C:\Program Files\LibreOffice\program\soffice.exe", @"C:\Program Files (x86)\LibreOffice\program\soffice.exe" }
    : new[] { "/usr/bin/soffice", "/usr/lib/libreoffice/program/soffice", "/usr/local/bin/soffice" };

var sofficeFound = sofficePaths.FirstOrDefault(File.Exists);
if (sofficeFound != null)
    app.Logger.LogInformation("[STARTUP] ✔ LibreOffice found at: {Path}", sofficeFound);
else
    app.Logger.LogWarning("[STARTUP] ✘ LibreOffice NOT found — Office-to-PDF conversions will fail in production. " +
                          "Fix: apt-get install -y libreoffice-core libreoffice-writer fonts-dejavu");

// SkiaSharp check — attempt to create a minimal surface to confirm native libs loaded
try
{
    using var surface = SkiaSharp.SKSurface.Create(new SkiaSharp.SKImageInfo(1, 1));
    app.Logger.LogInformation("[STARTUP] ✔ SkiaSharp native libs loaded successfully.");
}
catch (Exception ex)
{
    app.Logger.LogWarning("[STARTUP] ✘ SkiaSharp failed to initialize: {Err}. " +
                          "Fix: apt-get install -y libfontconfig1 libfreetype6 libx11-6", ex.Message);
}

// CORRECT middleware order: CORS → Routing → Exception Handler → Endpoints
// Production middleware
app.UseSecurityHeaders();
app.UseCors("AllowAll");
app.UseRouting();
app.UseExceptionHandling();
app.MapControllers();

// IndexNow Key Verification File
app.MapGet("/90c6861616c4493e813f0a5f973715df.txt", () => Results.Text("90c6861616c4493e813f0a5f973715df"));

// Root health check
app.MapGet("/", () => Results.Ok(new { status = "online", service = "ConvertHub API", time = DateTime.UtcNow }));

var port = Environment.GetEnvironmentVariable("PORT") ?? "8080";
app.Logger.LogInformation("Listening on port {Port}", port);
app.Run($"http://0.0.0.0:{port}");
