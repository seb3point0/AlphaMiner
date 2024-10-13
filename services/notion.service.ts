import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client } from '@notionhq/client';

@Injectable()
export class NotionService {
  private client: Client;
  private readonly logger = new Logger(NotionService.name);

  constructor(private configService: ConfigService) {
    this.client = new Client({ auth: this.configService.get<string>('notionToken') });
  }

  async saveToNotion(data: any) {
    try {
      const result = await this.client.pages.create({
        parent: { database_id: this.configService.get<string>('notionDatabaseId') },
        properties: {
          Name: { title: [{ text: { content: data.name } }] },
          Summary: { rich_text: [{ text: { content: data.summary } }] },
          Stage: { rich_text: [{ text: { content: data.stage } }] },
          Raising: { rich_text: [{ text: { content: data.raising } }] },
          FDV: { rich_text: [{ text: { content: data.fdv } }] },
          Deck: { rich_text: [{ text: { content: data.links.deck } }] },
        },
      });
      this.logger.log(`${result['properties']['Name']['title'][0]['text']['content']} added to Notion: ${result['url']}`);
      return result;
    } catch (error) {
      this.logger.error('Error adding data to Notion:', error);
      throw error;
    }
  }
}
