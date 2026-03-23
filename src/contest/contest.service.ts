import { Injectable } from '@nestjs/common';
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

}
