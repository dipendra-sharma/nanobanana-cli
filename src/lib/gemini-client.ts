import { GoogleGenAI } from '@google/genai';
import type { GeminiClientConfig } from '../types';
import { config } from '../utils/config';
import { Logger } from '../utils/logger';

export class GeminiClient {
  private client: GoogleGenAI;
  private model: string;

  constructor(clientConfig?: GeminiClientConfig) {
    const apiKey = clientConfig?.apiKey || config.getApiKey();
    this.client = new GoogleGenAI({ apiKey });
    this.model = clientConfig?.model || 'gemini-2.5-flash-image';
  }

  async generateImages(
    prompt: string,
    options: {
      numberOfImages?: number;
      aspectRatio?: string;
      seed?: number;
    } = {}
  ): Promise<Array<{ imageBytes: string }>> {
    try {
      const count = options.numberOfImages || 1;
      Logger.debug(`Generating ${count} image(s) with model: ${this.model}`);

      const results: Array<{ imageBytes: string }> = [];

      // Generate images sequentially
      for (let i = 0; i < count; i++) {
        const response = await this.client.models.generateContent({
          model: this.model,
          contents: [
            {
              role: 'user',
              parts: [{ text: prompt }],
            },
          ],
        });

        if (!response.candidates || !response.candidates[0]?.content?.parts) {
          throw new Error('No image generated - invalid response structure');
        }

        // Extract image from response
        for (const part of response.candidates[0].content.parts) {
          let imageBase64: string | undefined;

          if (part.inlineData?.data) {
            imageBase64 = part.inlineData.data;
          } else if (part.text && this.isValidBase64ImageData(part.text)) {
            imageBase64 = part.text;
          }

          if (imageBase64) {
            results.push({ imageBytes: imageBase64 });
            break; // Only process first valid image per response
          }
        }
      }

      if (results.length === 0) {
        throw new Error('No images generated - no valid image data in response');
      }

      return results;
    } catch (error: any) {
      Logger.error(`Image generation failed: ${error.message}`);
      throw error;
    }
  }

  private isValidBase64ImageData(data: string): boolean {
    if (!data || data.length < 1000) {
      return false;
    }
    const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/;
    return base64Regex.test(data);
  }

  async editImage(
    inputImageBytes: string,
    prompt: string,
    options: {
      aspectRatio?: string;
      maskImageBytes?: string;
    } = {}
  ): Promise<{ imageBytes: string }> {
    try {
      Logger.debug(`Editing image with prompt: ${prompt}`);

      const parts: any[] = [
        { text: prompt },
        {
          inlineData: {
            mimeType: 'image/png',
            data: inputImageBytes,
          },
        },
      ];

      if (options.maskImageBytes) {
        parts.push({
          inlineData: { mimeType: 'image/png', data: options.maskImageBytes },
        });
      }

      const response = await this.client.models.generateContent({
        model: this.model,
        contents: [
          {
            role: 'user',
            parts,
          },
        ],
      });

      if (!response.candidates || !response.candidates[0]?.content?.parts) {
        throw new Error('No edited image returned - invalid response structure');
      }

      // Extract image from response
      for (const part of response.candidates[0].content.parts) {
        let imageBase64: string | undefined;

        if (part.inlineData?.data) {
          imageBase64 = part.inlineData.data;
        } else if (part.text && this.isValidBase64ImageData(part.text)) {
          imageBase64 = part.text;
        }

        if (imageBase64) {
          return { imageBytes: imageBase64 };
        }
      }

      throw new Error('No edited image returned - no valid image data in response');
    } catch (error: any) {
      Logger.error(`Image editing failed: ${error.message}`);
      throw error;
    }
  }

  setModel(model: string): void {
    this.model = model;
  }

  getModel(): string {
    return this.model;
  }
}
