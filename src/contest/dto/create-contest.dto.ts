import { IsDateString, IsString, ValidateIf } from "class-validator";

export class CreateContestDto {
  @IsString()
  title: string;

  @IsDateString()
  startTime: string;

  @IsDateString()
  endTime: string;
}
