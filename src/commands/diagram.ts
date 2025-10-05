import ora from 'ora';
import type { DiagramOptions } from '../types';
import { GeminiClient } from '../lib/gemini-client';
import { FileHandler } from '../lib/file-handler';
import { PromptBuilder } from '../lib/prompt-builder';
import { Validators } from '../utils/validators';
import { Logger } from '../utils/logger';

export async function diagramCommand(options: DiagramOptions): Promise<void> {
  try {
    Validators.validatePrompt(options.prompt);

    const spinner = ora('Generating diagram...').start();

    const client = new GeminiClient();
    const fileHandler = new FileHandler(options.output);

    const prompt = PromptBuilder.buildDiagramPrompt(
      options.prompt,
      options.type,
      options.labeled ?? true
    );

    const images = await client.generateImages(prompt, {
      numberOfImages: 1,
      aspectRatio: '16:9',
    });

    spinner.succeed('Diagram generated successfully');

    const metadata = {
      prompt: options.prompt,
      model: client.getModel(),
      timestamp: new Date().toISOString(),
      type: options.type,
      labeled: options.labeled,
    };

    const processingOptions = {
      format: options.format,
      quality: options.quality,
    };

    const outputPath = await fileHandler.saveImage(
      images[0].imageBytes,
      fileHandler.generateFileName(`nb-diagram-${options.type || 'general'}`, processingOptions.format || 'png'),
      metadata as any,
      processingOptions
    );

    Logger.section('Result');
    Logger.result('Diagram', outputPath);
  } catch (error: any) {
    Logger.error(error.message);
    process.exit(1);
  }
}
