import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import * as cheerio from 'cheerio';
import * as fs from 'fs/promises';
import * as path from 'path';

@Injectable()
export class ScraperService {
  private readonly logger = new Logger(ScraperService.name);

  async scrapeWebsites(websites: string[]): Promise<void> {
    const results = [];

    for (const url of websites) {
      try {
        const content = await this.scrapePage(url);
        results.push(content);
        this.logger.log(`Successfully scraped ${url}`);
      } catch (error) {
        this.logger.error(`Error scraping ${url}: ${error.message}`);
      }
    }

    await this.saveResults(results);
  }

  private async scrapePage(url: string): Promise<any> {
    try {
      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          'Accept-Encoding': 'gzip, deflate, br',
          'Connection': 'keep-alive',
          'Upgrade-Insecure-Requests': '1',
          'Cache-Control': 'max-age=0',
        },
        timeout: 10000, // 10 seconds timeout
        maxRedirects: 5,
      });
      const $ = cheerio.load(response.data, {
        xml: true,
      });

      const title = $('title').text().trim();
      const content = $('body').text().trim();

      return {
        url,
        title,
        content,
      };
    } catch (error) {
      this.logger.error(`Error fetching ${url}: ${error.message}`);
      throw error;
    }
  }

  private async saveResults(results: any[]): Promise<void> {
    const outputDir = path.join(__dirname, '..', 'scraped_data');
    await fs.mkdir(outputDir, { recursive: true });

    const outputFile = path.join(outputDir, `scraped_content_${Date.now()}.json`);
    await fs.writeFile(outputFile, JSON.stringify(results, null, 2));

    this.logger.log(`Scraped content saved to ${outputFile}`);
  }
}
