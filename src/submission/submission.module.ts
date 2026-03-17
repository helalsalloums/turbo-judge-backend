import { Module } from '@nestjs/common';
import { SubmissionController } from './submission.controller';
import { SubmissionService } from './submission.service';
import { QueueModule } from 'src/queue/queue.module';

@Module({
  controllers: [SubmissionController],
  providers: [SubmissionService],
  imports: [QueueModule]
})
export class SubmissionModule { }
