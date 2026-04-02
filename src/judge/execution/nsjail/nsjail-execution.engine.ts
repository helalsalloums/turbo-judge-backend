import { Injectable } from "@nestjs/common";
import { spawn } from "child_process";
import {
  CompileRequest,
  CompileResult,
  ExecutionEngine,
  ProcessResult,
  RunRequest,
} from "../execution-engine.interface";
import { NsJailCommandBuilder } from "./nsjail-command.builder";

@Injectable()
export class NsJailExecutionEngine implements ExecutionEngine {
  constructor(
    private readonly builder: NsJailCommandBuilder,
  ) { }

  async compile(req: CompileRequest): Promise<CompileResult> {
    const { command, args } = this.builder.buildCompileCommand(req);
    const result = await this.spawnAndCollect(
      command,
      args,
      undefined,
      req.timeLimitMs,
    );

    return {
      ...result,
      ok: !result.timedOut && result.exitCode === 0,
    };
  }

  async run(req: RunRequest): Promise<ProcessResult> {
    const { command, args } = this.builder.buildRunCommand(req);
    return this.spawnAndCollect(
      command,
      args,
      req.stdin,
      req.timeLimitMs,
    );
  }

  private async spawnAndCollect(
    command: string,
    args: string[],
    stdin: string | undefined,
    timeoutMs: number,
  ): Promise<ProcessResult> {
    return new Promise((resolve, reject) => {
      const startedAt = Date.now();

      const proc = spawn(command, args, {
        stdio: ["pipe", "pipe", "pipe"],
      });

      let stdout = "";
      let stderr = "";
      let timedOut = false;
      let settled = false;

      const finish = (result: ProcessResult) => {
        if (settled) return;
        settled = true;
        resolve(result);
      };

      proc.stdout.on("data", (chunk: Buffer) => {
        stdout += chunk.toString();
      });

      proc.stderr.on("data", (chunk: Buffer) => {
        stderr += chunk.toString();
      });

      proc.on("error", (error) => {
        if (settled) return;
        settled = true;
        reject(error);
      });

      const timer = setTimeout(() => {
        timedOut = true;
        proc.kill("SIGKILL");
      }, timeoutMs);

      if (stdin) {
        proc.stdin.write(stdin);
      }
      proc.stdin.end();

      proc.on("close", (exitCode, signal) => {
        clearTimeout(timer);

        finish({
          stdout,
          stderr,
          exitCode,
          signal,
          timedOut,
          durationMs: Date.now() - startedAt,
        });
      });
    });
  }
}
