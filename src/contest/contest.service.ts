import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateContestDto } from './dto/create-contest.dto';

@Injectable()
export class ContestService {
  constructor(private prisma: PrismaService) { }

  async create(createContestDto: CreateContestDto) {
    const newContest = await this.prisma.contest.create({
      data: { ...createContestDto }
    })

    return {
      message: "Contest created successfully", contest: newContest
    }
  }

  async findAll() {
    const contests = await this.prisma.contest.findMany();
    return { message: "Contests fetched", contests }
  }

  async findOne(contestId: number) {
    const contest = await this.prisma.contest.findUnique({
      where: { id: contestId }
    })

    if (!contest) throw new NotFoundException('Contest not found')

    return { message: "contest fetched", contest }
  }

  async register(contestId: number, userId: number) {
    await this.findOne(contestId);

    try {
      const registration = await this.prisma.contestRegistration.create({
        data: { contestId, userId }
      })

      return { message: "successfully registered", registration }
    } catch (error) {
      if (error.code === 'P2002') throw new ConflictException('Already registered to this contest')
      throw (error)
    }
  }
}
