import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProblemDto } from './dto/create-problem.dto';
import { UpdateProblemDto } from './dto/update-problem.dto';

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

  async update(id: number, updateProblemDto: UpdateProblemDto) {
    await this.findOne(id); // just to throw exception if not found

    const updated = await this.prisma.problem.update({
      where: { id },
      data: updateProblemDto
    });

    return { message: "Problem Updated", problem: updated }
  }

  async remove(id: number) {
    await this.findOne(id);

    await this.prisma.problem.delete({
      where: { id }

    });

    return { message: `Problem ${id} deleted` }
  }
}
