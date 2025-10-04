import ora from 'ora';
import type { IconOptions } from '../types';
import { GeminiClient } from '../lib/gemini-client';
import { FileHandler } from '../lib/file-handler';
import { PromptBuilder } from '../lib/prompt-builder';
import { Validators } from '../utils/validators';
import { Logger } from '../utils/logger';

export async function iconCommand(options: IconOptions): Promise<void> {
  try {
    Validators.validatePrompt(options.prompt);

    const sizes = options.sizes || [16, 32, 64, 128, 256, 512];
    Validators.validateSizes(sizes);

    const spinner = ora(`Generating icons in ${sizes.length} sizes...`).start();

    const client = new GeminiClient();
    const fileHandler = new FileHandler(options.output);

    const allPaths: string[] = [];

    for (const size of sizes) {
      spinner.text = `Generating ${size}x${size}px icon...`;

      const prompt = PromptBuilder.buildIconPrompt(options.prompt, size);

      const images = await client.generateImages(prompt, {
        numberOfImages: 1,
        aspectRatio: '1:1',
      });

      const metadata = {
        prompt: options.prompt,
        model: client.getModel(),
        timestamp: new Date().toISOString(),
        size,
      };

      const processingOptions = {
        format: options.format,
        quality: options.quality,
        resize: options.resize || { width: size, height: size },
      };

      const filename = fileHandler.generateFileName(`nb-icon-${size}x${size}`, processingOptions.format || 'png');
      const path = await fileHandler.saveImage(images[0].imageBytes, filename, metadata as any, processingOptions);
      allPaths.push(path);
    }

    spinner.succeed(`Generated ${sizes.length} icon sizes`);

    Logger.section('Results');
    allPaths.forEach((path, i) => {
      Logger.result(`Icon ${sizes[i]}x${sizes[i]}`, path);
    });
  } catch (error: any) {
    Logger.error(error.message);
    process.exit(1);
  }
}
