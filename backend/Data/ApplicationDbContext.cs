using ConvertHub.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace ConvertHub.Api.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<FileRecord> Files { get; set; }
        public DbSet<ConversionJob> Conversions { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure Users indexes
            modelBuilder.Entity<User>()
                .HasIndex(u => u.Email)
                .IsUnique();

            // Configure Files
            modelBuilder.Entity<FileRecord>()
                .HasIndex(f => new { f.UserId, f.CreatedAt })
                .IsDescending(false, true);

            // Configure Conversions
            modelBuilder.Entity<ConversionJob>()
                .HasIndex(c => c.Status);

            modelBuilder.Entity<ConversionJob>()
                .HasOne(c => c.FileRecord)
                .WithOne(f => f.ConversionJob)
                .HasForeignKey<ConversionJob>(c => c.FileId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<FileRecord>()
                .HasOne(f => f.User)
                .WithMany(u => u.Files)
                .HasForeignKey(f => f.UserId)
                .OnDelete(DeleteBehavior.SetNull);
        }
    }
}
