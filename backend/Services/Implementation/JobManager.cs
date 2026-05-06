using ConvertHub.Api.Models;
using System.Collections.Concurrent;

namespace ConvertHub.Api.Services.Implementation
{
    public class JobManager
    {
        private readonly ConcurrentDictionary<string, JobStatus> _jobs = new();

        public string CreateJob(string originalFileName, ConversionType type)
        {
            var job = new JobStatus
            {
                OriginalFileName = originalFileName,
                Type = type
            };
            _jobs[job.JobId] = job;
            return job.JobId;
        }

        public JobStatus? GetJob(string jobId)
        {
            return _jobs.TryGetValue(jobId, out var job) ? job : null;
        }

        public void UpdateJob(string jobId, Action<JobStatus> updateAction)
        {
            if (_jobs.TryGetValue(jobId, out var job))
            {
                updateAction(job);
            }
        }

        public List<JobStatus> GetAllJobs()
        {
            return _jobs.Values.OrderByDescending(j => j.CreatedAt).ToList();
        }
    }
}
