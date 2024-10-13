import { Module } from '@nestjs/common';
import { TelegramService } from '../../services/telegram.service';
import { OpenAIService } from '../../services/openai.service';
import { NotionService } from '../../services/notion.service';
import { PromptService } from '../../services/prompt.service';

@Module({
  providers: [TelegramService, OpenAIService, NotionService, PromptService],
})
export class TelegramModule {}