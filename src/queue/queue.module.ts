import { Module } from '@nestjs/common';
import { QueueService } from './queue.service';
import { BullModule } from '@nestjs/bullmq';

@Module({
  imports: [
    BullModule.forRoot({
      connection: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT!)
      }
    }),
    BullModule.registerQueue({
      name: 'submission',
    })
  ],
  providers: [QueueService],
  exports: [BullModule]
})
export class QueueModule { }
