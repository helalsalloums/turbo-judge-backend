import { Module } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { JudgeService } from "./judge.service";
import { SubmissionGateway } from "./submission.gateway";
import { WorkspaceService } from "./workspace/workspace.service";
import { SubmissionStatusService } from "./status/submission-status.service";
import { NSJAIL_CONFIG, nsjailConfig } from "./execution/nsjail/nsjail.config";
import { NsJailCommandBuilder } from "./execution/nsjail/nsjail-command.builder";
import { NsJailExecutionEngine } from "./execution/nsjail/nsjail-execution.engine";

@Module({
  providers: [
    JudgeService,
    PrismaService,
    SubmissionGateway,
    WorkspaceService,
    SubmissionStatusService,
    NsJailCommandBuilder,
    NsJailExecutionEngine,
    {
      provide: NSJAIL_CONFIG,
      useValue: nsjailConfig,
    },
    {
      provide: "ExecutionEngine",
      useExisting: NsJailExecutionEngine,
    },
  ],
  exports: [JudgeService],
})
export class JudgeModule { }
