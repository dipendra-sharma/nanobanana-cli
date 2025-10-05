import ora from 'ora';
import { GeminiClient } from '../lib/gemini-client';
import { FileHandler } from '../lib/file-handler';
import { Validators } from '../utils/validators';
import { Logger } from '../utils/logger';

export async function naturalLanguageCommand(
  prompt: string,
  options: { output?: string; count?: number } = {}
): Promise<void> {
  try {
    Validators.validatePrompt(prompt);

    const count = options.count || 1;
    Validators.validateCount(count);

    const spinner = ora('Processing natural language request...').start();

    const client = new GeminiClient();
    const fileHandler = new FileHandler(options.output);

    const images = await client.generateImages(prompt, {
      numberOfImages: count,
    });

    spinner.succeed(`Generated ${images.length} image(s)`);

    const metadata = {
      prompt,
      model: client.getModel(),
      timestamp: new Date().toISOString(),
    };

    const paths = await fileHandler.saveImages(images, 'nb-nl', metadata);

    Logger.section('Results');
    paths.forEach((path, i) => {
      Logger.result(`Image ${i + 1}`, path);
    });
  } catch (error: any) {
    Logger.error(error.message);
    process.exit(1);
  }
}
