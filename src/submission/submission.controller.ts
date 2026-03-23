import { Body, Controller, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { CreateSubmissionDto } from './dto/create-submission.dto';
import { SubmissionService } from './submission.service';
import { JwtAuthGuard } from 'src/auth/jwt.guard';

@Controller('submission')
export class SubmissionController {

  constructor(private submissionService: SubmissionService) { }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createSubmissionDto: CreateSubmissionDto, @Req() req: any) {
    return this.submissionService.create(createSubmissionDto, req.user.userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.submissionService.findOne(+id);
  }

  @Get()
  findAll(@Query('page') page: string = '1', @Query('limi') limit: string = '10') {
    return this.submissionService.findAll(+page, +limit);
  }

}
