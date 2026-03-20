import { Body, Controller, Param, Post } from '@nestjs/common';
import { TestcaseService } from './testcase.service';
import { CreateTestCaseDto } from './dto/create-testcase.dto';

@Controller('testcase')
export class TestcaseController {
  constructor(private testCaseService: TestcaseService) { }
  @Post(':id')
  create(@Param('id') problemId: string, @Body() createTestCaseDto: CreateTestCaseDto) {
    return this.testCaseService.create(+problemId, createTestCaseDto);
  }
}
