import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProblemDto } from './dto/create-problem.dto';

@Injectable()
export class ProblemService {
  constructor(private prisma: PrismaService) { }

  async create(createProblemDto: CreateProblemDto) {
    const newProblem = await this.prisma.problem.create({
      data: {
        ...createProblemDto
      }
    });

    return { message: "Problem created", problem: newProblem }
  }
}
