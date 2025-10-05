import ora from 'ora';
import type { PatternOptions } from '../types';
import { GeminiClient } from '../lib/gemini-client';
import { FileHandler } from '../lib/file-handler';
import { PromptBuilder } from '../lib/prompt-builder';
import { Validators } from '../utils/validators';
import { Logger } from '../utils/logger';

export async function patternCommand(options: PatternOptions): Promise<void> {
  try {
    Validators.validatePrompt(options.prompt);

    const spinner = ora('Generating pattern...').start();

    const client = new GeminiClient();
    const fileHandler = new FileHandler(options.output);

    const prompt = PromptBuilder.buildPatternPrompt(
      options.prompt,
      options.tileable ?? true,
      options.density,
      options.colors
    );

    const images = await client.generateImages(prompt, {
      numberOfImages: 1,
      aspectRatio: '1:1',
    });

    spinner.succeed('Pattern generated successfully');

    const metadata = {
      prompt: options.prompt,
      model: client.getModel(),
      timestamp: new Date().toISOString(),
      tileable: options.tileable,
      density: options.density,
    };

    const processingOptions = {
      format: options.format,
      quality: options.quality,
    };

    const outputPath = await fileHandler.saveImage(
      images[0].imageBytes,
      fileHandler.generateFileName('nb-pattern', processingOptions.format || 'png'),
      metadata as any,
      processingOptions
    );

    Logger.section('Result');
    Logger.result('Pattern', outputPath);

    if (options.tileable) {
      Logger.info('Pattern is designed to be seamlessly tileable');
    }
  } catch (error: any) {
    Logger.error(error.message);
    process.exit(1);
  }
}
