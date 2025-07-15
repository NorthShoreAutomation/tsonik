import { Tsonik } from 'tsonik';

/**
 * Example demonstrating job operations
 */
async function jobExamples() {
  const client = new Tsonik({
    appId: 'your-app-id',
    authToken: 'your-auth-token'
  });

  try {
    // List jobs
    const jobs = await client.jobs.listJobs({
      per_page: 50,
      page: 1,
      sort: 'date_created'
    });
    console.log(`Found ${jobs.data.objects.length} jobs`);

    // Create a new job
    const job = await client.jobs.createJob({
      title: 'Transcoding Job',
      type: 'TRANSCODE',
      status: 'READY',
      custom_type: 'video_encode'
    });
    console.log(`Created job: ${job.data.id}`);

    // Get a specific job
    const retrievedJob = await client.jobs.getJob(job.data.id);
    console.log(`Job status: ${retrievedJob.data.status}`);
    console.log(`Job type: ${retrievedJob.data.type}`);

    // Update a job
    await client.jobs.updateJob(job.data.id, {
      title: 'Updated Job Title',
      status: 'STARTED'
    });
    console.log('Job updated successfully');

    // Create multiple jobs for bulk operations
    const job2 = await client.jobs.createJob({
      title: 'Second Job',
      type: 'TRANSCODE',
      status: 'READY'
    });

    const job3 = await client.jobs.createJob({
      title: 'Third Job', 
      type: 'TRANSCODE',
      status: 'READY'
    });

    // Bulk edit jobs  
    await client.jobs.bulkEditJobs(
      {
        ids: `${job2.data.id},${job3.data.id}`
      },
      {
        status: 'ABORTED'
      }
    );
    console.log('Jobs bulk edited successfully');

    // Bulk delete jobs
    await client.jobs.bulkDelete([job2.data.id, job3.data.id]);
    console.log('Jobs bulk deleted successfully');

    // Clean up the first job (commented out for safety)
    // await client.jobs.deleteJob(job.data.id);
    // console.log('Job deleted successfully');

  } catch (error) {
    console.error('Error in job examples:', error);
  }
}

export { jobExamples };