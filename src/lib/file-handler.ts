import { existsSync, mkdirSync, writeFileSync, readFileSync } from 'fs';
import { join, dirname, basename, extname } from 'path';
import type { ImageGenerationResult } from '../types';
import { Logger } from '../utils/logger';
import { ImageProcessor, type ImageProcessingOptions } from './image-processor';

export class FileHandler {
  private outputDir: string;

  constructor(outputDir: string = './output') {
    this.outputDir = outputDir;
    this.ensureOutputDir();
  }

  private ensureOutputDir(): void {
    if (!existsSync(this.outputDir)) {
      mkdirSync(this.outputDir, { recursive: true });
    }
  }

  generateFileName(prefix: string, extension: string = 'png', index?: number): string {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    const indexSuffix = index !== undefined ? `-${index + 1}` : '';
    const ext = ImageProcessor.getFileExtension(extension as any);
    return `${prefix}-${timestamp}${indexSuffix}.${ext}`;
  }

  async saveImage(
    imageBytes: string,
    filename?: string,
    metadata?: ImageGenerationResult['metadata'],
    processingOptions?: ImageProcessingOptions
  ): Promise<string> {
    const fileName = filename || this.generateFileName('nb-image');
    const filePath = join(this.outputDir, fileName);

    const dir = dirname(filePath);
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }

    let buffer: Buffer;

    // Process image if options provided
    if (processingOptions && (processingOptions.format || processingOptions.quality)) {
      buffer = await ImageProcessor.convertFromBase64(imageBytes, processingOptions);
    } else {
      buffer = Buffer.from(imageBytes, 'base64');
    }

    writeFileSync(filePath, buffer);

    if (metadata) {
      this.saveMetadata(filePath, metadata);
    }

    Logger.success(`Image saved: ${filePath}`);
    return filePath;
  }

  async saveImages(
    images: Array<{ imageBytes: string }>,
    prefix: string = 'nb-image',
    metadata?: ImageGenerationResult['metadata'],
    processingOptions?: ImageProcessingOptions
  ): Promise<string[]> {
    const paths: string[] = [];

    const extension = processingOptions?.format || 'png';

    for (let i = 0; i < images.length; i++) {
      const filename = this.generateFileName(prefix, extension, images.length > 1 ? i : undefined);
      const path = await this.saveImage(images[i].imageBytes, filename, metadata, processingOptions);
      paths.push(path);
    }

    return paths;
  }

  private saveMetadata(imagePath: string, metadata: ImageGenerationResult['metadata']): void {
    const metadataPath = imagePath.replace(/\.(png|jpg|jpeg|webp)$/, '.json');
    writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));
  }

  loadImage(imagePath: string): string {
    if (!existsSync(imagePath)) {
      throw new Error(`Image not found: ${imagePath}`);
    }
    const buffer = readFileSync(imagePath);
    return buffer.toString('base64');
  }

  getOutputPath(filename?: string): string {
    if (!filename) {
      return this.outputDir;
    }
    return join(this.outputDir, filename);
  }

  setOutputDir(dir: string): void {
    this.outputDir = dir;
    this.ensureOutputDir();
  }
}
