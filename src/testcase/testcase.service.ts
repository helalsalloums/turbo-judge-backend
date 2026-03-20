import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTestCaseDto } from './dto/create-testcase.dto';

@Injectable()
export class TestcaseService {
  constructor(private prisma: PrismaService) { }

  async create(problemId: number, createTestCaseDto: CreateTestCaseDto) {
    const newTestCase = await this.prisma.testCase.create({
      data: { ...createTestCaseDto, problemId }
    });

    return { message: "test case created successfully", test_case: newTestCase }
  }

  async findAll(problemId: number) {
    const testCases = await this.prisma.testCase.findMany({
      where: { problemId: problemId }
    });

    return { message: `test cases fetched for problem ${problemId}`, testCases }
  }
}
