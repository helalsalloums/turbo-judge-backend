import { Injectable } from "@nestjs/common";
import { spawn } from "child_process";
import { randomUUID } from "crypto";
import { writeFile } from "fs/promises";
import { PrismaService } from "src/prisma/prisma.service";
import { SubmissionGateway } from "./submission.gateway";

@Injectable()
export class JudgeService {

  constructor(private prisma: PrismaService, private submissionGateway: SubmissionGateway) { }

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

      if (!submission) throw new Error('Submission not found');

      const problem = await this.prisma.problem.findUnique({
        where: { id: submission!.problemId }
      })

      const testCases = await this.prisma.testCase.findMany({
        where: { problemId: submission!.problemId }
      });

      if (!problem) throw new Error('Problem not found');
      if (!testCases) throw new Error('TestCases not found');

      const sourceFile = `/tmp/${randomUUID()}.cpp`;
      await writeFile(sourceFile, submission!.code);
      const binaryFile = `/tmp/${randomUUID()}`;

      this.submissionGateway.server.emit('submission:status', { submissionId, status: 'compiling' });
      this.prisma.submission.update({
        where: { id: submissionId },
        data: {
          status: 'Compiling'
        }

      });

      await this.compile(sourceFile, binaryFile);

      for (let i = 0; i < testCases.length; i++) {

        this.submissionGateway.server.emit('submission:status', { submissionId, status: `Running on test ${i + 1}` });

        this.prisma.submission.update({
          where: { id: submissionId },
          data: {
            status: `Running on test ${i + 1}`
          }

        });

        const output = await this.run(binaryFile, testCases[i].input, problem!.timeLimit);

        if (output !== testCases[i].output) {
          throw (new Error(`Wrong answer on test ${i + 1}`));
        }
      }

      this.submissionGateway.server.emit('submission:status', { submissionId, status: 'Accepted' });

      this.prisma.submission.update({
        where: { id: submissionId },
        data: {
          status: 'Accepted'
        }
      });

      return 'Accepted';

    }
    catch (error) {
      this.submissionGateway.server.emit('submission:status', { submissionId, status: error.message });

      this.prisma.submission.update({
        where: { id: submissionId },
        data: {
          status: error.message
        }
      });

      if (error.message === 'Compilation failed') return 'CE';
      if (error.message.startsWith('Wrong answer')) return 'WA';
      if (error.message === 'TLE') return 'TLE';
      return 'Runtime Error';
    }
  }
}
