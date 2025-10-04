import { existsSync } from 'fs';
import type { AspectRatio } from '../types';

export class Validators {
  static validatePrompt(prompt: string): void {
    if (!prompt || prompt.trim().length === 0) {
      throw new Error('Prompt cannot be empty');
    }
    if (prompt.length > 4000) {
      throw new Error('Prompt is too long (max 4000 characters)');
    }
  }

  static validateImagePath(path: string): void {
    if (!existsSync(path)) {
      throw new Error(`Image file not found: ${path}`);
    }
    const validExtensions = ['.jpg', '.jpeg', '.png', '.webp'];
    const hasValidExtension = validExtensions.some(ext =>
      path.toLowerCase().endsWith(ext)
    );
    if (!hasValidExtension) {
      throw new Error(`Invalid image format. Supported: ${validExtensions.join(', ')}`);
    }
  }

  static validateCount(count: number): void {
    if (count < 1 || count > 8) {
      throw new Error('Count must be between 1 and 8');
    }
  }

  static validateAspectRatio(ratio: string): ratio is AspectRatio {
    const validRatios: AspectRatio[] = [
      '1:1', '16:9', '9:16', '4:3', '3:4', '21:9', '9:21', '3:2', '2:3'
    ];
    return validRatios.includes(ratio as AspectRatio);
  }

  static validateSizes(sizes: number[]): void {
    const validSizes = [16, 32, 64, 128, 256, 512, 1024];
    for (const size of sizes) {
      if (!validSizes.includes(size)) {
        throw new Error(
          `Invalid size: ${size}. Valid sizes: ${validSizes.join(', ')}`
        );
      }
    }
  }
}
