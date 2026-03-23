import { IsDateString, IsString, ValidateIf } from "class-validator";

export class CreateContestDto {
  @IsString()
  title: string;

  @IsDateString()
  startTime: string;

  @IsDateString()
  @ValidateIf((o) => new Date(o.endTime) > new Date(o.startTime))
  endTime: string;
}
