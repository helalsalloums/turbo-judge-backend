import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { CreateSubmissionDto } from './dto/create-submission.dto';
import { SubmissionService } from './submission.service';
import { CreateProblemDto } from 'src/problem/dto/create-problem.dto';

@Controller('submission')
export class SubmissionController {

  constructor(private submissionService: SubmissionService) { }

  @Post()
  create(@Body() createSubmissionDto: CreateSubmissionDto) {
    return this.submissionService.create(createSubmissionDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.submissionService.findOne(+id);
  }

  @Get()
  findAll() {
    return this.submissionService.findAll();
  }

}
