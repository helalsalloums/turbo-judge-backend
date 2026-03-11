import { IsArray, IsInt, IsOptional, IsString, Min } from "class-validator";

export class UpdateProblemDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  text?: string;

  @IsOptional()
  @IsInt()
  @Min(800)
  difficulty?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  topics?: string[];


  @IsOptional()
  @IsInt()
  memoryLimit?: number;

  @IsOptional()
  @IsInt()
  timeLimit?: number;
}
