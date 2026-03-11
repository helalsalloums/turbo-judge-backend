import { IsArray, IsInt, IsString, Min } from "class-validator";

export class CreateProblemDto {
  @IsString()
  title: string;

  @IsString()
  text: string;

  @IsInt()
  @Min(800)
  difficulty: number;

  @IsArray()
  @IsString({ each: true })
  topics: string[];


  @IsInt()
  memoryLimit: number;

  @IsInt()
  timeLimit: number;
}
