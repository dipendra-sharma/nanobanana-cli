import ora from 'ora';
import type { StoryOptions } from '../types';
import { GeminiClient } from '../lib/gemini-client';
import { FileHandler } from '../lib/file-handler';
import { PromptBuilder } from '../lib/prompt-builder';
import { Validators } from '../utils/validators';
import { Logger } from '../utils/logger';

export async function storyCommand(options: StoryOptions): Promise<void> {
  try {
    Validators.validatePrompt(options.prompt);

    if (options.scenes < 2 || options.scenes > 8) {
      throw new Error('Number of scenes must be between 2 and 8');
    }

    if (options.aspectRatio && !Validators.validateAspectRatio(options.aspectRatio)) {
      throw new Error(
        `Invalid aspect ratio: ${options.aspectRatio}. Valid options: 1:1, 16:9, 9:16, 4:3, 3:4, 21:9, 9:21, 3:2, 2:3`
      );
    }

    const spinner = ora(`Generating story with ${options.scenes} scenes...`).start();

    const client = new GeminiClient();
    const fileHandler = new FileHandler(options.output);

    const prompts = PromptBuilder.buildStoryPrompts(options.prompt, options.scenes);

    const allPaths: string[] = [];

    for (let i = 0; i < prompts.length; i++) {
      spinner.text = `Generating scene ${i + 1} of ${options.scenes}...`;

      const images = await client.generateImages(prompts[i], {
        numberOfImages: 1,
        aspectRatio: options.aspectRatio || '16:9',
      });

      const metadata = {
        prompt: prompts[i],
        model: client.getModel(),
        timestamp: new Date().toISOString(),
        scene: i + 1,
        totalScenes: options.scenes,
      };

      const processingOptions = {
        format: options.format,
        quality: options.quality,
        resize: options.resize,
      };

      const filename = fileHandler.generateFileName(`nb-story-scene-${i + 1}`, processingOptions.format || 'png');
      const path = await fileHandler.saveImage(images[0].imageBytes, filename, metadata as any, processingOptions);
      allPaths.push(path);
    }

    spinner.succeed(`Generated ${options.scenes} story scenes`);

    Logger.section('Results');
    allPaths.forEach((path, i) => {
      Logger.result(`Scene ${i + 1}`, path);
    });
  } catch (error: any) {
    Logger.error(error.message);
    process.exit(1);
  }
}
