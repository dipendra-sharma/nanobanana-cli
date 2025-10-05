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

      // Note: gemini-2.5-flash-image doesn't support candidateCount > 1
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
          config: {
            seed: options.seed,
            imageConfig: options.aspectRatio
              ? {
                  aspectRatio: options.aspectRatio,
                }
              : undefined,
          },
        });

        if (!response.candidates || !response.candidates[0]?.content?.parts) {
          throw new Error('No image generated - invalid response structure');
        }

        // Extract image from response
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData?.data) {
            results.push({ imageBytes: part.inlineData.data });
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
        if (part.inlineData?.data) {
          return { imageBytes: part.inlineData.data };
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
