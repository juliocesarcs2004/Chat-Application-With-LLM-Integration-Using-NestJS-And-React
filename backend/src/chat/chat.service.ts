import { Injectable } from '@nestjs/common';
import { LlmService } from '../llm/llm.service';

@Injectable()
export class ChatService {
  constructor(private readonly llmService: LlmService) { }

  async processMessage(message: string): Promise<{ reply: string }> {
    const llmReply = await this.llmService.generateReply(message);
    return { reply: llmReply };
  }
}