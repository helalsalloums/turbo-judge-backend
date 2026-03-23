import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSubmissionDto } from './dto/create-submission.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class SubmissionService {
  constructor(
    @InjectQueue('submission') private submissionQueue: Queue,
    private prisma: PrismaService
  ) { }

  async create(createSubmissionDto: CreateSubmissionDto, userId: number) {
    const newSubmission = await this.prisma.submission.create({
      data: {
        code: createSubmissionDto.code,
        language: createSubmissionDto.language,
        problemId: createSubmissionDto.problemId,
        userId: userId
      }
    })

    await this.submissionQueue.add('judge', { submissionId: newSubmission.id });

    return { message: "Submission created", submission: newSubmission }
  }

  async findOne(id: number) {
    const submission = await this.prisma.submission.findUnique({
      where: { id: id }
    })

    if (!submission) throw new NotFoundException(`Submission #${id} Not Found`)

    return { message: "Submission found", submission }
  }

  async findAll(page: number, limit: number) {
    const submissions = await this.prisma.submission.findMany({
      skip: limit * (page - 1),
      take: limit,
    });

    return { message: "Submissions fetched", submissions };
  }
}
