import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Telegraf } from 'telegraf';
import { toMarkdownV2 } from '@telegraf/entity';
import { OpenAIService } from '../services/openai.service';
import { NotionService } from '../services/notion.service';
import { PromptService } from '../services/prompt.service';

@Injectable()
export class TelegramService implements OnModuleInit {
  private bot: Telegraf;
  private readonly logger = new Logger(TelegramService.name);

  constructor(
    private configService: ConfigService,
    private openAIService: OpenAIService,
    private notionService: NotionService,
    private promptService: PromptService,
  ) {
    this.bot = new Telegraf(this.configService.get<string>('telegramToken'));
  }

  onModuleInit() {
    this.bot.on('text', this.handleMessage.bind(this));
    this.bot.launch();
  }

  private async handleMessage(ctx: any) {
    try {
      const message = toMarkdownV2(ctx.message).replace(/\\([^\\])/g, '$1');
      const prompt = await this.promptService.getPrompt('analysis');
      const content = `${prompt} [${message}]`;

      this.logger.log('Processing message...');
      await ctx.reply('AI processing message...');

      try {
        const chat = await this.openAIService.createChatCompletion(content);
        this.logger.log('ChatGPT response received: ' + chat.choices[0].message.content);

        const companies = JSON.parse(chat.choices[0].message.content);

        // Send a message indicating the number of companies detected
        await ctx.reply(`${companies.length} companies detected. Processing...`);

        let notionObjects = [];

        for (let company of companies) {
          const notionObject = await this.notionService.saveToNotion(company);
          notionObjects.push(notionObject);
        }

        const responseMessage = this.createResponseMessage(notionObjects);

        await ctx.reply(responseMessage);

        this.logger.log('Response sent to Telegram');
      } catch (error) {
        console.error(error);
        await ctx.reply('An error occurred while processing the companies. Please try again later.');
      }
    } catch (error) {
      console.error('Error in handleMessage:', error);
      await ctx.reply('An error occurred while processing your message. Please try again later.');
    }
  }

  private createResponseMessage(notionObjects: any[]): string {
    let responseMessage = 'Companies added to Notion:\n\n';
    for (let i = 0; i < notionObjects.length; i++) {
      const companyName = notionObjects[i].properties.Name.title[0].text.content;
      const companyUrl = notionObjects[i].url;
      responseMessage += `- ${companyName}: ${companyUrl}\n`;
    }
    return responseMessage;
  }
}