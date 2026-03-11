import { IsNumber, IsString } from "class-validator";

export class CreateSubmissionDto {

  @IsString()
  code: string;

  @IsString()
  language: string;

  @IsNumber()
  problemId: number;

}
