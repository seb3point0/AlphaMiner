# AlphaMiner

AlphaMiner is an advanced Telegram bot designed for VCs and investors to streamline their deal flow management process. Leveraging the power of OpenAI's GPT models and Notion's database capabilities, AlphaMiner automates the extraction and organization of key information from startup pitches and company descriptions.

## Key Features:

1. **Telegram Integration**: Receive and process startup pitches directly through Telegram messages.

2. **AI-Powered Information Extraction**: Utilizes OpenAI's GPT models to intelligently parse and extract relevant information from unstructured text.

3. **Structured Data Storage**: Automatically saves extracted company information to a Notion database, creating a searchable and organized deal flow repository.

4. **Real-time Feedback**: Provides immediate responses in Telegram, confirming the number of companies detected and processed.

5. **Customizable Prompts**: Allows for easy customization of AI prompts to fine-tune information extraction based on specific needs.

6. **Scalable NestJS Architecture**: Built on NestJS, ensuring a modular, maintainable, and scalable codebase.

AlphaMiner streamlines the often time-consuming process of managing incoming startup pitches, allowing VCs and investors to focus on analysis and decision-making rather than data entry and organization.

This project is inspired by [autoVC](https://github.com/BRENMA).

## Prerequisites

- Node.js (v14 or later)
- Yarn (v1.22 or later)
- Telegram Bot Token ([How to create a bot](https://core.telegram.org/bots/tutorial))
- OpenAI API Key
- Notion API Key and Database ID

## How to Use:

1. Clone the repository:
   ```
   git clone https://github.com/seb3point0/AlphaMiner.git
   cd AlphaMiner
   ```

2. Install dependencies:
   ```
   yarn install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory and add the following:
   ```
   OPENAI_TOKEN=your_openai_api_key
   TELEGRAM_TOKEN=your_telegram_bot_token
   NOTION_TOKEN=your_notion_api_key
   NOTION_DATABASE_ID=your_notion_database_id
   ```

4. Store prompts:
   Place your prompt files in the `src/prompts` directory as markdown files.

5. Build the application:
   ```
   yarn build
   ```

6. Start the application:
   ```
   yarn start
   ```
   For development with hot-reload:
   ```
   yarn start:dev
   ```

7. Interact with the bot through Telegram to analyze text and save structured data to Notion.

## Development

- Run tests: `yarn test`
- Run linter: `yarn lint`
- Format code: `yarn format`

## Todo: 
- Improve prompt to handle edge cases
- Add website scraping
- Fetch Docsend deck and perform OCR
- Generate detailed report based on scraped data and deck

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.
