import { Injectable } from '@nestjs/common';
import { CreateSubmissionDto } from './dto/create-submission.dto';

@Injectable()
export class SubmissionService {
  create(createSubmissionDto: CreateSubmissionDto) {
    return { status: "accepted", time: 42 };
  }

}
