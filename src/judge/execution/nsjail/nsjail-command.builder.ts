import { Inject, Injectable } from "@nestjs/common";
import {
  CompileRequest,
  RunRequest,
} from "../execution-engine.interface";

import { NSJAIL_CONFIG } from "./nsjail.config";
import type { NsJailConfig } from "./nsjail.config";

@Injectable()
export class NsJailCommandBuilder {
  constructor(
    @Inject(NSJAIL_CONFIG)
    private readonly config: NsJailConfig,
  ) { }

  buildCompileCommand(req: CompileRequest): { command: string; args: string[] } {
    const timeLimitSec = Math.max(
      1,
      Math.ceil(req.timeLimitMs / 1000),
    );

    const args = [
      "--mode",
      "o",
      "--cwd",
      req.workspaceDir,
      "--time_limit",
      String(timeLimitSec),
      "--rlimit_as",
      String(req.memoryLimitMb),
      "--max_cpus",
      "1",
      "--disable_clone_newnet",
      this.config.disableNetwork ? "" : "",
      "--user",
      String(this.config.uid),
      "--group",
      String(this.config.gid),
      "--",
      "/usr/bin/g++",
      req.sourceFile,
      "-O2",
      "-std=c++17",
      "-o",
      req.outputFile,
    ].filter(Boolean);

    return {
      command: this.config.binaryPath,
      args,
    };
  }

  buildRunCommand(req: RunRequest): { command: string; args: string[] } {
    const timeLimitSec = Math.max(
      1,
      Math.ceil(req.timeLimitMs / 1000),
    );

    const args = [
      "--mode",
      "o",
      "--cwd",
      req.workspaceDir,
      "--time_limit",
      String(timeLimitSec),
      "--rlimit_as",
      String(req.memoryLimitMb),
      "--max_cpus",
      "1",
      "--disable_clone_newnet",
      this.config.disableNetwork ? "" : "",
      "--user",
      String(this.config.uid),
      "--group",
      String(this.config.gid),
      "--",
      req.executablePath,
    ].filter(Boolean);

    return {
      command: this.config.binaryPath,
      args,
    };
  }
}
