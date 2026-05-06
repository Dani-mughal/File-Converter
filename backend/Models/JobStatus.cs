using System;

namespace ConvertHub.Api.Models
{
    public class JobStatus
    {
        public string JobId { get; set; } = Guid.NewGuid().ToString();
        public string? OriginalFileName { get; set; }
        public ConversionType Type { get; set; }
        public JobState State { get; set; } = JobState.Pending;
        public int Progress { get; set; } = 0;
        public string? OutputPath { get; set; }
        public string? ErrorMessage { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? CompletedAt { get; set; }
    }

    public enum JobState
    {
        Pending,
        Processing,
        Completed,
        Failed
    }
}
