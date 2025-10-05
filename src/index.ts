#!/usr/bin/env bun

import { Command } from 'commander';
import { generateCommand } from './commands/generate';
import { editCommand } from './commands/edit';
import { restoreCommand } from './commands/restore';
import { iconCommand } from './commands/icon';
import { patternCommand } from './commands/pattern';
import { storyCommand } from './commands/story';
import { diagramCommand } from './commands/diagram';
import { naturalLanguageCommand } from './commands/nl';
import { config } from './utils/config';
import { Logger } from './utils/logger';
import pkg from '../package.json';

const program = new Command();

program
  .name('nb')
  .description('nanobanana - AI-powered image generation CLI using Gemini')
  .version(pkg.version, '-v, -V, --version', 'output the version number');

program
  .command('generate <prompt>')
  .description('Generate images from text prompt')
  .option('-s, --style <style>', 'image style (photorealistic, watercolor, anime, etc.)')
  .option('-a, --aspect-ratio <ratio>', 'aspect ratio (1:1, 16:9, 9:16, etc.)')
  .option('-o, --output <dir>', 'output directory', './output')
  .option('--seed <number>', 'seed for reproducible results')
  .option('--variations', 'generate variations of the same prompt', false)
  .option('-f, --format <format>', 'output format (png, jpg, webp)', 'png')
  .option('-q, --quality <number>', 'image quality 1-100', '90')
  .option('-n, --num-images <number>', 'number of images to generate', '1')
  .action(async (prompt: string, options: any) => {
    await generateCommand({
      prompt,
      count: parseInt(options.numImages),
      style: options.style,
      aspectRatio: options.aspectRatio,
      output: options.output,
      seed: options.seed ? parseInt(options.seed) : undefined,
      variations: options.variations,
      format: options.format,
      quality: parseInt(options.quality),
    });
  });

program
  .command('edit <input> <prompt>')
  .description('Edit an existing image')
  .option('-o, --output <dir>', 'output directory', './output')
  .option('-m, --mask <path>', 'mask image for selective editing')
  .option('--operation <type>', 'operation type (add, remove, modify)')
  .option('-f, --format <format>', 'output format (png, jpg, webp)', 'png')
  .option('-q, --quality <number>', 'image quality 1-100', '90')
  .action(async (input: string, prompt: string, options: any) => {
    await editCommand({
      input,
      prompt,
      output: options.output,
      mask: options.mask,
      operation: options.operation,
      format: options.format,
      quality: parseInt(options.quality),
    });
  });

program
  .command('restore <input>')
  .description('Restore and enhance an image')
  .option('-o, --output <dir>', 'output directory', './output')
  .option('-q, --quality <level>', 'quality level (low, medium, high)', 'medium')
  .option('--denoise', 'focus on noise reduction', false)
  .option('-f, --format <format>', 'output format (png, jpg, webp)', 'png')
  .option('--image-quality <number>', 'image quality 1-100', '90')
  .action(async (input: string, options: any) => {
    await restoreCommand({
      input,
      output: options.output,
      quality: options.quality,
      denoise: options.denoise,
      format: options.format,
      imageQuality: parseInt(options.imageQuality),
    });
  });

program
  .command('icon <prompt>')
  .description('Generate app icons in multiple sizes')
  .option('-s, --sizes <sizes>', 'comma-separated sizes (16,32,64,128,256,512)', '16,32,64,128,256,512')
  .option('-o, --output <dir>', 'output directory', './output')
  .option('--padding <number>', 'padding around icon')
  .option('-f, --format <format>', 'output format (png, jpg, webp)', 'png')
  .option('-q, --quality <number>', 'image quality 1-100', '90')
  .action(async (prompt: string, options: any) => {
    const sizes = options.sizes.split(',').map((s: string) => parseInt(s.trim()));
    await iconCommand({
      prompt,
      sizes,
      output: options.output,
      padding: options.padding ? parseInt(options.padding) : undefined,
      format: options.format,
      quality: parseInt(options.quality),
    });
  });

program
  .command('pattern <prompt>')
  .description('Generate seamless patterns and textures')
  .option('-o, --output <dir>', 'output directory', './output')
  .option('--tileable', 'ensure pattern is seamlessly tileable', true)
  .option('--density <level>', 'pattern density (low, medium, high)')
  .option('--colors <colors>', 'comma-separated color palette')
  .option('-f, --format <format>', 'output format (png, jpg, webp)', 'png')
  .option('-q, --quality <number>', 'image quality 1-100', '90')
  .action(async (prompt: string, options: any) => {
    const colors = options.colors ? options.colors.split(',').map((c: string) => c.trim()) : undefined;
    await patternCommand({
      prompt,
      output: options.output,
      tileable: options.tileable,
      density: options.density,
      colors,
      format: options.format,
      quality: parseInt(options.quality),
    });
  });

program
  .command('story <prompt>')
  .description('Generate sequential images for a visual story')
  .option('-n, --scenes <number>', 'number of scenes', '4')
  .option('-a, --aspect-ratio <ratio>', 'aspect ratio (1:1, 16:9, etc.)', '16:9')
  .option('-o, --output <dir>', 'output directory', './output')
  .option('--style-consistency', 'maintain consistent style across scenes', true)
  .option('-f, --format <format>', 'output format (png, jpg, webp)', 'png')
  .option('-q, --quality <number>', 'image quality 1-100', '90')
  .action(async (prompt: string, options: any) => {
    await storyCommand({
      prompt,
      scenes: parseInt(options.scenes),
      aspectRatio: options.aspectRatio,
      output: options.output,
      styleConsistency: options.styleConsistency,
      format: options.format,
      quality: parseInt(options.quality),
    });
  });

program
  .command('diagram <prompt>')
  .description('Generate technical diagrams and flowcharts')
  .option('-t, --type <type>', 'diagram type (flowchart, sequence, architecture, network, erd, mindmap)')
  .option('-o, --output <dir>', 'output directory', './output')
  .option('--labeled', 'include labels and annotations', true)
  .option('-f, --format <format>', 'output format (png, jpg, webp)', 'png')
  .option('-q, --quality <number>', 'image quality 1-100', '90')
  .action(async (prompt: string, options: any) => {
    await diagramCommand({
      prompt,
      type: options.type,
      output: options.output,
      labeled: options.labeled,
      format: options.format,
      quality: parseInt(options.quality),
    });
  });

program
  .argument('[prompt...]', 'natural language prompt')
  .option('-n, --num-images <number>', 'number of images', '1')
  .option('-o, --output <dir>', 'output directory', './output')
  .action(async (promptParts: string[], options: any) => {
    if (promptParts.length === 0) {
      program.help();
      return;
    }
    const prompt = promptParts.join(' ');
    await naturalLanguageCommand(prompt, {
      count: parseInt(options.numImages),
      output: options.output,
    });
  });

// Check if user is requesting help or version (don't require API key for these)
const isHelpOrVersion = process.argv.includes('-h') ||
  process.argv.includes('--help') ||
  process.argv.includes('-v') ||
  process.argv.includes('-V') ||
  process.argv.includes('--version');

if (!isHelpOrVersion && !config.hasApiKey()) {
  Logger.error(
    'API key not found. Please set GEMINI_API_KEY or GOOGLE_API_KEY environment variable.'
  );
  process.exit(1);
}

program.parse();
