import sharp from 'sharp';
import { Logger } from '../utils/logger';

export type ImageFormat = 'png' | 'jpg' | 'jpeg' | 'webp';

export interface ImageProcessingOptions {
  format?: ImageFormat;
  quality?: number;
}

export class ImageProcessor {
  static async processImage(
    inputBuffer: Buffer,
    options: ImageProcessingOptions = {}
  ): Promise<Buffer> {
    try {
      let pipeline = sharp(inputBuffer);

      // Apply format conversion and quality
      const format = options.format || 'png';
      const quality = options.quality !== undefined ? options.quality : 90;

      switch (format) {
        case 'webp':
          pipeline = pipeline.webp({ quality });
          Logger.debug(`Converting to WebP with quality ${quality}`);
          break;
        case 'jpg':
        case 'jpeg':
          pipeline = pipeline.jpeg({ quality });
          Logger.debug(`Converting to JPEG with quality ${quality}`);
          break;
        case 'png':
        default:
          pipeline = pipeline.png({
            quality,
            compressionLevel: Math.floor((100 - quality) / 10),
          });
          Logger.debug(`Converting to PNG with quality ${quality}`);
          break;
      }

      return await pipeline.toBuffer();
    } catch (error: any) {
      Logger.error(`Image processing failed: ${error.message}`);
      throw error;
    }
  }

  static async convertFromBase64(
    base64Data: string,
    options: ImageProcessingOptions = {}
  ): Promise<Buffer> {
    const inputBuffer = Buffer.from(base64Data, 'base64');
    return this.processImage(inputBuffer, options);
  }

  static getFileExtension(format?: ImageFormat): string {
    if (!format) return 'png';
    return format === 'jpg' ? 'jpg' : format;
  }

  static validateFormat(format: string): format is ImageFormat {
    return ['png', 'jpg', 'jpeg', 'webp'].includes(format.toLowerCase());
  }

  static validateQuality(quality: number): boolean {
    return quality >= 1 && quality <= 100;
  }

  static async resizeImage(
    inputBuffer: Buffer,
    width: number,
    height: number
  ): Promise<Buffer> {
    try {
      return await sharp(inputBuffer)
        .resize(width, height, {
          fit: 'inside',
          withoutEnlargement: false,
        })
        .toBuffer();
    } catch (error: any) {
      Logger.error(`Image resize failed: ${error.message}`);
      throw error;
    }
  }
}
