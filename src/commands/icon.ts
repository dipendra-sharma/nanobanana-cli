import ora from 'ora';
import type { IconOptions } from '../types';
import { GeminiClient } from '../lib/gemini-client';
import { FileHandler } from '../lib/file-handler';
import { PromptBuilder } from '../lib/prompt-builder';
import { ImageProcessor } from '../lib/image-processor';
import { Validators } from '../utils/validators';
import { Logger } from '../utils/logger';

export async function iconCommand(options: IconOptions): Promise<void> {
  try {
    Validators.validatePrompt(options.prompt);

    const sizes = options.sizes || [256, 512, 1024];
    Validators.validateSizes(sizes);

    const spinner = ora(`Generating icons in ${sizes.length} sizes...`).start();

    const client = new GeminiClient();
    const fileHandler = new FileHandler(options.output);

    const allPaths: string[] = [];

    for (const size of sizes) {
      spinner.text = `Generating ${size}x${size}px icon...`;

      const prompt = PromptBuilder.buildIconPrompt(options.prompt);

      const images = await client.generateImages(prompt, {
        numberOfImages: 1,
        aspectRatio: '1:1',
      });

      // Convert base64 to buffer
      let buffer = Buffer.from(images[0].imageBytes, 'base64');

      // Apply format conversion and quality
      if (options.format || options.quality) {
        const processed = await ImageProcessor.processImage(buffer, {
          format: options.format,
          quality: options.quality,
        });
        buffer = Buffer.from(processed);
      }

      // Resize to requested size (Gemini generates 1024x1024 for 1:1)
      const resized = await ImageProcessor.resizeImage(buffer, size, size);
      buffer = Buffer.from(resized);

      const metadata = {
        prompt: options.prompt,
        model: client.getModel(),
        timestamp: new Date().toISOString(),
        size,
      };

      const filename = fileHandler.generateFileName(`nb-icon-${size}x${size}`, options.format || 'png');

      // Save the processed and resized buffer directly
      const { writeFileSync } = await import('fs');
      const { join } = await import('path');
      const filePath = join(fileHandler.getOutputPath(), filename);
      writeFileSync(filePath, buffer);

      // Save metadata
      const metadataPath = filePath.replace(/\.(png|jpg|jpeg|webp)$/, '.json');
      writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));

      Logger.success(`Image saved: ${filePath}`);
      allPaths.push(filePath);
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
