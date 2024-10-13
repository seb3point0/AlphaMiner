# AlphaMiner

AlphaMiner is a bot for VCs and investors managing deal flow through Telegram. The bot receives blubs, extracts relevant data using OpenAI’s API and saves them to a Notion database. 

This project is inspired by [autoVC](https://github.com/BRENMA).

## How to Use:

1.	Clone the repository.
2.	Set up environment variables (.env) for OPENAI_TOKEN, TELEGRAM_TOKEN, NOTION_TOKEN, and NOTION_DATABASE_ID.
3.	Store prompts in the designated prompts directory as markdown files.
4.	Run the bot and interact through Telegram to analyze text and save structured data to Notion.

## Todo: 
- Improve prompt to handle edge cases
- Add website scraping
- Fetch Docsend deck and perform OCR
- Generate detailed report based on scraped data and deck