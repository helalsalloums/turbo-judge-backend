import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ProblemService } from './problem.service';
import { CreateProblemDto } from './dto/create-problem.dto';

@Controller('problem')
export class ProblemController {

  constructor(private problemService: ProblemService) { }

  @Post()
  create(@Body() createProblemDto: CreateProblemDto) {
    return this.problemService.create(createProblemDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.problemService.findOne(+id);
  }

  @Get()
  findAll() {
    return this.problemService.findAll();
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() createProblemDto: CreateProblemDto) {
    return this.problemService.update(+id, createProblemDto);
  }
}
