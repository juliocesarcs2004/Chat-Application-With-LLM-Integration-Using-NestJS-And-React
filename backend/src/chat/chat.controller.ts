import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) { }

  @Post()
  @HttpCode(HttpStatus.OK)
  async handleChatMessage(@Body() createChatDto: CreateChatDto): Promise<{ reply: string }> {
    return this.chatService.processMessage(createChatDto.message);
  }
}