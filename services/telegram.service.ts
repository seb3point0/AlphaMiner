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
      const promptMessages = await this.promptService.getPrompt('analysis');
      
      promptMessages.user = (promptMessages.user || '') + ` [${message}]`;

      await this.replyHandler('✨ Processing blurb with AI ✨', ctx);

      try {
        const chat = await this.openAIService.createChatCompletion(
          Object.entries(promptMessages).map(([role, content]) => ({
            role: role as 'system' | 'user' | 'assistant',
            content
          }))
        );

        const content = chat.choices[0].message.content;
        await this.replyHandler('ChatGPT response received: ' + content);

        const companies = JSON.parse(this.cleanAndValidateJSON(content));

        await this.replyHandler('Clean JSON: ' + companies);

        // Send a message indicating the number of companies detected
        await this.replyHandler(`${companies.length} companies detected. Processing...`, ctx);

        let notionObjects = [];

        for (let company of companies) {
          const notionObject = await this.notionService.saveToNotion(company);
          notionObjects.push(notionObject);
        }

        const responseMessage = this.createResponseMessage(notionObjects);

        await this.replyHandler(responseMessage, ctx);

      } catch (error) {
        console.error(error);
        await this.replyHandler('An error occurred while processing the companies. Please try again later.', ctx);
      }
    } catch (error) {
      console.error('Error in handleMessage:', error);
      await this.replyHandler('An error occurred while processing your message. Please try again later.', ctx);
    }
  }

  private cleanAndValidateJSON(jsonString: string): string {
    // Remove markdown codeblock tags
    let cleanedJSON = jsonString.replace(/^```json\s*|\s*```$/g, '').trim();

    try {
      let parsedJSON = JSON.parse(cleanedJSON);
      parsedJSON = this.removeUnwantedValues(parsedJSON, ['na', 'N/A', 'not applicable', 'none', 'null', 'undefined']);

      // If the response is an object, add it to an array
      if (!Array.isArray(parsedJSON)) {
        parsedJSON = [parsedJSON];
      }

      return JSON.stringify(parsedJSON);
    } catch (error) {
      this.logger.error('Error parsing JSON:', error);
      return '[]';
    }
  }

  private removeUnwantedValues(obj: any, valuesToRemove: string[]): any {
    if (Array.isArray(obj)) {
      return obj.map(v => this.removeUnwantedValues(v, valuesToRemove)).filter(v => v !== undefined);
    } else if (typeof obj === 'object' && obj !== null) {
      return Object.fromEntries(
        Object.entries(obj)
          .map(([k, v]) => [k, this.removeUnwantedValues(v, valuesToRemove)])
          .filter(([_, v]) => v !== undefined && !this.isUnwantedValue(v, valuesToRemove))
      );
    } else if (this.isUnwantedValue(obj, valuesToRemove)) {
      return undefined;
    }
    return obj;
  }

  private isUnwantedValue(value: any, valuesToRemove: string[]): boolean {
    if (typeof value === 'string') {
      return valuesToRemove.includes(value.toLowerCase()) || value === '' || value === '[]' || value === '{}';
    }
    return value === null || value === undefined;
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

  // New method to handle reply and logging
  private async replyHandler(message: string, ctx?: any): Promise<void> {
    this.logger.log(`Message: ${message}`);
    
    if (ctx) {
      await ctx.reply(message);
      this.logger.log(`Sent to Telegram: ${message}`);
    }
  }
}
