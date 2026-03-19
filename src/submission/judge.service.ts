import { Injectable } from "@nestjs/common";
import { spawn } from "child_process";
import { randomUUID } from "crypto";
import { writeFile } from "fs/promises";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class JudgeService {

  constructor(private prisma: PrismaService) { }

  private async compile(sourceFile: string, outputBinary: string): Promise<void> {
    return new Promise((resolve, reject) => {

      const proc = spawn('g++', [sourceFile, '-o', outputBinary]);

      proc.on('close', (exitCode) => {
        if (exitCode === 0) {
          resolve();
        } else {
          reject(new Error('Compilation failed'));
        }
      })
    });
  }
  private async run(binary: string, input: string, timeLimit: number): Promise<string> {
    return new Promise((resolve, reject) => {

      const proc = spawn(binary, []);
      let output = '';

      proc.stdout.on('data', (chunk) => {
        output += chunk.toString();
      });

      proc.on('close', (exitCode) => {
        resolve(output.trim());
      });

      setTimeout(() => {
        proc.kill();
        reject(new Error('TLE'));
      }, timeLimit)

      proc.stdin.write(input);
      proc.stdin.end()
    });
  }

  async judge(submissionId: number): Promise<string | undefined> {

    try {
      const submission = await this.prisma.submission.findUnique({
        where: { id: submissionId }
      })

      const problem = await this.prisma.problem.findUnique({
        where: { id: submission!.problemId }
      })

      const testCases = await this.prisma.testCase.findMany({
        where: { problemId: submission!.problemId }
      });

      if (!submission) throw new Error('Submission not found');
      if (!problem) throw new Error('Problem not found');
      if (!testCases) throw new Error('TestCases not found');

      const sourceFile = `/tmp/${randomUUID()}.cpp`;
      await writeFile(sourceFile, submission!.code);
      const binaryFile = `/tmp/${randomUUID()}`;
      await this.compile(sourceFile, binaryFile);

      for (let i = 0; i < testCases.length; i++) {
        const output = await this.run(binaryFile, testCases[i].input, problem!.timeLimit);
        if (output !== testCases[i].output) {
          throw (new Error(`Wrong answer on test ${i + 1}`));
        }
      }

      return 'Accepted';

    } catch (error) {
      console.log(error);
    }
  }
}
