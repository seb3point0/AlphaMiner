import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs/promises';
import * as path from 'path';

@Injectable()
export class PromptService {
  constructor(private configService: ConfigService) {}

  async getPrompt(prompt: string): Promise<string> {
    try {
      const promptsDir = this.configService.get<string>('promptsDir');
      if (!promptsDir) {
        throw new Error('Prompts directory not configured');
      }

      const filePath = path.join(promptsDir, `${prompt}.md`);
      const data = await fs.readFile(filePath, 'utf-8');
      return data
        .replace(/\r?\n|\r/g, ' ')
        .replace(/\s\s+/g, ' ')
        .replace(/\t/g, '')
        .trim();
    } catch (error) {
      console.error(`Error reading prompt file '${prompt}.md':`, error);
      throw new Error(`Failed to load prompt: ${prompt}`);
    }
  }
}