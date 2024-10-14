import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs/promises';
import * as path from 'path';

@Injectable()
export class PromptService {
  constructor(private configService: ConfigService) {}

  async getPrompt(prompt: string): Promise<Record<string, string>> {
    const promptFile =  `${prompt}.md`;
    try {
      const promptsDir = this.configService.get<string>('promptsDir');
      if (!promptsDir) {
        throw new Error('Prompts directory not configured');
      }

      const filePath = path.join(promptsDir, promptFile);
      const data = await fs.readFile(filePath, 'utf-8');

      const roleMatches = this.matchRoles(data);

      if (Object.keys(roleMatches).length === 0) {
        return { user: this.cleanContent(data) };
      }

      return roleMatches;
    } catch (error) {
      console.error(`Error reading prompt file '${promptFile}':`, error);
      throw new Error(`Failed to load prompt: ${prompt}`);
    }
  }

  private matchRoles(content: string): Record<string, string> {
    const roleRegex = /<(\w+)>([\s\S]*?)<\/\1>/g;
    const matches: Record<string, string> = {};
    let match;

    while ((match = roleRegex.exec(content)) !== null) {
      const [, role, text] = match;
      matches[role.toLowerCase()] = this.cleanContent(text);
    }

    return matches;
  }

  private cleanContent(content: string): string {
    return content
      .replace(/\r?\n|\r/g, ' ')
      .replace(/\s\s+/g, ' ')
      .replace(/\t/g, '')
      .trim();
  }
}
