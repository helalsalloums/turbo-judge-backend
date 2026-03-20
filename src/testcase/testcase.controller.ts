import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { TestcaseService } from './testcase.service';
import { CreateTestCaseDto } from './dto/create-testcase.dto';
import { Role } from 'src/auth/roles.decorator';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { RolesGuard } from 'src/auth/roles.guard';

@Controller('testcase')
export class TestcaseController {

  constructor(private testCaseService: TestcaseService) { }


  @Role('ADMIN')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post(':id')
  create(@Param('id') problemId: string, @Body() createTestCaseDto: CreateTestCaseDto) {
    return this.testCaseService.create(+problemId, createTestCaseDto);
  }

  @Get(':id')
  findAll(@Param('id') problemId: string) {
    return this.testCaseService.findAll(+problemId);
  }

  @Delete(':id')
  delte(@Param('id') testCaseId: string) {
    return this.testCaseService.delete(+testCaseId);
  }
}
