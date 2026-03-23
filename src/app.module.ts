import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { SubmissionModule } from './submission/submission.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { ProblemModule } from './problem/problem.module';
import { QueueModule } from './queue/queue.module';
import { TestcaseModule } from './testcase/testcase.module';
import { ContestModule } from './contest/contest.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    SubmissionModule,
    PrismaModule,
    ProblemModule,
    QueueModule,
    TestcaseModule,
    ContestModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
