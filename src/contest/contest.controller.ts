import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Req, UseGuards } from '@nestjs/common';
import { CreateContestDto } from './dto/create-contest.dto';
import { ContestService } from './contest.service';
import { Role } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { JwtAuthGuard } from 'src/auth/jwt.guard';

@Controller('contest')
export class ContestController {
  constructor(private contestService: ContestService) { }

  @Role('ADMIN')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  create(@Body() createContestDto: CreateContestDto) {
    return this.contestService.create(createContestDto)
  }

  @Get()
  findAll() {
    return this.contestService.findAll()
  }

  @Get(':id')
  findOne(@Param('id') contestId: string) {
    return this.contestService.findOne(+contestId)
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/register')
  register(@Param('id', ParseIntPipe) contestId: number, @Req() req: any) {
    return this.contestService.register(contestId, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id/unregister')
  unregister(@Param('id', ParseIntPipe) contestId: number, @Req() req: any) {
    return this.contestService.unregister(contestId, req.user.userId);
  }


  @Role('ADMIN')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post(':id/problems')
  addProblem(@Param('id', ParseIntPipe) contestId: number, @Body('problemId', ParseIntPipe) problemId: number) {
    return this.contestService.addProblem(contestId, problemId);
  }


  @Role('ADMIN')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id/problems')
  deleteProblem(@Param('id', ParseIntPipe) contestId: number, @Body('problemId', ParseIntPipe) problemId: number) {
    return this.contestService.deleteProblem(contestId, problemId);
  }
}
