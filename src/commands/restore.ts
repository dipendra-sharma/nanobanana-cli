import ora from 'ora';
import type { RestoreOptions } from '../types';
import { GeminiClient } from '../lib/gemini-client';
import { FileHandler } from '../lib/file-handler';
import { PromptBuilder } from '../lib/prompt-builder';
import { Validators } from '../utils/validators';
import { Logger } from '../utils/logger';

export async function restoreCommand(options: RestoreOptions): Promise<void> {
  try {
    Validators.validateImagePath(options.input);

    const spinner = ora('Restoring image...').start();

    const client = new GeminiClient();
    const fileHandler = new FileHandler(options.output);

    const inputImageBytes = fileHandler.loadImage(options.input);

    let prompt = PromptBuilder.buildRestorePrompt();

    if (options.quality === 'high') {
      prompt += ' Apply maximum enhancement and detail improvement.';
    } else if (options.quality === 'low') {
      prompt += ' Apply gentle enhancement while preserving original character.';
    }

    if (options.denoise) {
      prompt += ' Focus on noise reduction and artifact removal.';
    }

    const result = await client.editImage(inputImageBytes, prompt);

    spinner.succeed('Image restored successfully');

    const metadata = {
      prompt: 'Image restoration',
      model: client.getModel(),
      timestamp: new Date().toISOString(),
      quality: options.quality,
    };

    const processingOptions = {
      format: options.format,
      quality: options.imageQuality,
    };

    const outputPath = await fileHandler.saveImage(
      result.imageBytes,
      fileHandler.generateFileName('nb-restore', processingOptions.format || 'png'),
      metadata as any,
      processingOptions
    );

    Logger.section('Result');
    Logger.result('Restored image', outputPath);
  } catch (error: any) {
    Logger.error(error.message);
    process.exit(1);
  }
}
