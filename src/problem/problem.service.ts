import { Injectable, NotFoundException } from '@nestjs/common';
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

  async findOne(id: number) {
    const problem = await this.prisma.problem.findUnique({
      where: { id: id }
    });

    if (!problem) throw new NotFoundException(`Problem #${id} not Found`);

    return { message: "Problem found", problem }
  }

  async findAll() {
    const problems = await this.prisma.problem.findMany();

    return { message: "Problems fetched", problems }
  }
}
