import ora from 'ora';
import type { GenerateOptions } from '../types';
import { GeminiClient } from '../lib/gemini-client';
import { FileHandler } from '../lib/file-handler';
import { PromptBuilder } from '../lib/prompt-builder';
import { Validators } from '../utils/validators';
import { Logger } from '../utils/logger';

export async function generateCommand(options: GenerateOptions): Promise<void> {
  try {
    Validators.validatePrompt(options.prompt);

    const count = options.count || 1;
    Validators.validateCount(count);

    if (options.aspectRatio && !Validators.validateAspectRatio(options.aspectRatio)) {
      throw new Error(
        `Invalid aspect ratio: ${options.aspectRatio}. Valid options: 1:1, 16:9, 9:16, 4:3, 3:4, 21:9, 9:21, 3:2, 2:3`
      );
    }

    const spinner = ora('Generating images...').start();

    const client = new GeminiClient();
    const fileHandler = new FileHandler(options.output);

    const prompt = PromptBuilder.buildGeneratePrompt(options.prompt, options.style);

    const images = await client.generateImages(prompt, {
      numberOfImages: count,
      aspectRatio: options.aspectRatio,
      seed: options.seed,
    });

    spinner.succeed(`Generated ${images.length} image(s)`);

    const metadata = {
      prompt: options.prompt,
      model: client.getModel(),
      timestamp: new Date().toISOString(),
      seed: options.seed,
    };

    const processingOptions = {
      format: options.format,
      quality: options.quality,
      resize: options.resize,
    };

    const paths = await fileHandler.saveImages(images, 'nb-generate', metadata, processingOptions);

    Logger.section('Results');
    paths.forEach((path, i) => {
      Logger.result(`Image ${i + 1}`, path);
    });
  } catch (error: any) {
    Logger.error(error.message);
    process.exit(1);
  }
}
