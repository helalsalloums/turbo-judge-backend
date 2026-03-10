import { Injectable } from '@nestjs/common';
import { CreateSubmissionDto } from './dto/create-submission.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SubmissionService {
  constructor(private prisma: PrismaService) { }

  async create(createSubmissionDto: CreateSubmissionDto) {
    const newSubmission = await this.prisma.submission.create({
      data: {
        code: createSubmissionDto.code,
        language: createSubmissionDto.language,
        problemId: createSubmissionDto.problemId,
      }
    })

    return { message: "Submission created", submission: newSubmission }
  }

}
