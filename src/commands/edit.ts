import ora from 'ora';
import type { EditOptions } from '../types';
import { GeminiClient } from '../lib/gemini-client';
import { FileHandler } from '../lib/file-handler';
import { PromptBuilder } from '../lib/prompt-builder';
import { Validators } from '../utils/validators';
import { Logger } from '../utils/logger';

export async function editCommand(options: EditOptions): Promise<void> {
  try {
    Validators.validatePrompt(options.prompt);
    Validators.validateImagePath(options.input);

    if (options.mask) {
      Validators.validateImagePath(options.mask);
    }

    const spinner = ora('Editing image...').start();

    const client = new GeminiClient();
    const fileHandler = new FileHandler(options.output);

    const inputImageBytes = fileHandler.loadImage(options.input);
    const maskImageBytes = options.mask ? fileHandler.loadImage(options.mask) : undefined;

    const prompt = PromptBuilder.buildEditPrompt(options.prompt, options.operation);

    const result = await client.editImage(inputImageBytes, prompt, {
      maskImageBytes,
    });

    spinner.succeed('Image edited successfully');

    const metadata = {
      prompt: options.prompt,
      model: client.getModel(),
      timestamp: new Date().toISOString(),
      operation: options.operation,
    };

    const processingOptions = {
      format: options.format,
      quality: options.quality,
    };

    const outputPath = await fileHandler.saveImage(
      result.imageBytes,
      fileHandler.generateFileName('nb-edit', processingOptions.format || 'png'),
      metadata as any,
      processingOptions
    );

    Logger.section('Result');
    Logger.result('Edited image', outputPath);
  } catch (error: any) {
    Logger.error(error.message);
    process.exit(1);
  }
}
