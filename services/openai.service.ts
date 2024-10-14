import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { ChatCompletionMessageParam } from 'openai/resources/chat';

@Injectable()
export class OpenAIService {
  private client: OpenAI;
  private readonly logger = new Logger(OpenAIService.name);
  private readonly model: string;

  constructor(private configService: ConfigService) {
    this.client = new OpenAI({ apiKey: this.configService.get<string>('openaiToken') });
    this.model = this.configService.get<string>('openaiModel');
  }

  async createChatCompletion(messages: ChatCompletionMessageParam[]) {
    return this.client.chat.completions.create({
      model: this.model,
      messages,
    });
  }

  async processContent(messages: ChatCompletionMessageParam[]): Promise<any[]> {
    try {
      const chat = await this.createChatCompletion(messages);
      this.logger.log('ChatGPT response received: ' + chat.choices[0].message.content);
      return JSON.parse(chat.choices[0].message.content);
    } catch (error) {
      this.logger.error('Error processing content with OpenAI:', error);
      throw error;
    }
  }
}
