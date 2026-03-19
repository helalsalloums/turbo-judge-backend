import { Module } from '@nestjs/common';
import { SubmissionController } from './submission.controller';
import { SubmissionService } from './submission.service';
import { QueueModule } from 'src/queue/queue.module';
import { SubmissionProcessor } from './submission.processor';
import { JudgeService } from './judge.service';

@Module({
  controllers: [SubmissionController],
  providers: [SubmissionService, SubmissionProcessor, JudgeService],
  imports: [QueueModule]
})
export class SubmissionModule { }
