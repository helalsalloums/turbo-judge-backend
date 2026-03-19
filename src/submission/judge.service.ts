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

  async judge(submissionId: number): Promise<string> { }
}
