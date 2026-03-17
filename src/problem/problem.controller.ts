import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ProblemService } from './problem.service';
import { CreateProblemDto } from './dto/create-problem.dto';
import { UpdateProblemDto } from './dto/update-problem.dto';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { Role } from 'src/auth/roles.decorator';

@Controller('problem')
export class ProblemController {

  constructor(private problemService: ProblemService) { }


  @Role('ADMIN')
  @UseGuards(JwtAuthGuard)
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

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProblemDto: UpdateProblemDto) {
    return this.problemService.update(+id, updateProblemDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.problemService.remove(+id);
  }
}
