import { Body, Controller, Post } from '@nestjs/common';
import { CreateSubmissionDto } from './dto/create-submission.dto';
import { SubmissionService } from './submission.service';

@Controller('submission')
export class SubmissionController {

  constructor(private submissionService: SubmissionService) { }

  @Post()
  create(@Body() createSubmissionDto: CreateSubmissionDto) {
    return this.submissionService.create(createSubmissionDto);
  }
}
