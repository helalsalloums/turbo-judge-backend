import { Injectable } from "@nestjs/common";
import { spawn } from "child_process";

@Injectable()
export class JudgeService {
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
  private async run(binary: string, input: string, timeLimit: number): Promise<string> { }
  async judge(submissionId: number): Promise<string> { }
}
