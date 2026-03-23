import { Body, Controller, Post, UseGuards } from '@nestjs/common';
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
}
