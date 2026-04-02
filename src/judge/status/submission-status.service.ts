import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { SubmissionGateway } from "../submission.gateway";

@Injectable()
export class SubmissionStatusService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly submissionGateway: SubmissionGateway,
  ) { }

  async setStatus(submissionId: number, status: string): Promise<void> {
    this.submissionGateway.server.emit("submission:status", {
      submissionId,
      status,
    });

    await this.prisma.submission.update({
      where: { id: submissionId },
      data: { status },
    });
  }
}
