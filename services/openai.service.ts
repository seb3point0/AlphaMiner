import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

@Injectable()
export class OpenAIService {
  private client: OpenAI;
  private readonly logger = new Logger(OpenAIService.name);

  constructor(private configService: ConfigService) {
    this.client = new OpenAI({ apiKey: this.configService.get<string>('openaiToken') });
  }

  async createChatCompletion(content: string) {
    return this.client.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content }],
    });
  }

  async processContent(content: string): Promise<any[]> {
    try {
      const chat = await this.createChatCompletion(content);
      this.logger.log('ChatGPT response received: ' + chat.choices[0].message.content);
      return JSON.parse(chat.choices[0].message.content);
    } catch (error) {
      this.logger.error('Error processing content with OpenAI:', error);
      throw error;
    }
  }
}
