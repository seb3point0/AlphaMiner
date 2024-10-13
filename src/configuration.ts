import * as path from 'path';

export default () => ({
  openaiToken: process.env.OPENAI_TOKEN,
  telegramToken: process.env.TELEGRAM_TOKEN,
  openaiProjectIsd: process.env.OPENAI_PROJECT_ID,
  notionToken: process.env.NOTION_TOKEN,
  notionDatabaseId: process.env.NOTION_DATABASE_ID,
  docsendEmail: process.env.DOCSEND_EMAIL,
  promptsDir: path.join(process.cwd(), 'src', 'prompts'),
  screenshotsDir: path.join(process.cwd(), 'src', 'screenshots'),
});
