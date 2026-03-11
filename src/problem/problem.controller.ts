import { Body, Controller, Post } from '@nestjs/common';
import { ProblemService } from './problem.service';
import { CreateProblemDto } from './dto/create-problem.dto';

@Controller('problem')
export class ProblemController {

  constructor(private problemService: ProblemService) { }

  @Post()
  create(@Body() createProblemDto: CreateProblemDto) {
    return this.problemService.create(createProblemDto);
  }
}
