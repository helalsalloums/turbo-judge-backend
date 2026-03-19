import { Processor, WorkerHost } from "@nestjs/bullmq";
import { Job } from "bullmq";

@Processor('submission')
export class SubmissionProcessor extends WorkerHost {
  async process(job: Job) {
    if (job.name === 'judge') {
      console.log('Job received', job.data);
    }
  }
}
