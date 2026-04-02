export interface CompileRequest {
  workspaceDir: string;
  sourceFile: string;
  outputFile: string;
  timeLimitMs: number;
  memoryLimitMb: number;
}

export interface RunRequest {
  workspaceDir: string;
  executablePath: string;
  stdin: string;
  timeLimitMs: number;
  memoryLimitMb: number;
}

export interface ProcessResult {
  stdout: string;
  stderr: string;
  exitCode: number | null;
  signal: NodeJS.Signals | null;
  timedOut: boolean;
  durationMs: number;
}

export interface CompileResult extends ProcessResult {
  ok: boolean;
}

export interface ExecutionEngine {
  compile(req: CompileRequest): Promise<CompileResult>;
  run(req: RunRequest): Promise<ProcessResult>;
}
