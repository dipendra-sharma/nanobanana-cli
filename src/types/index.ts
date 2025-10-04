export type AspectRatio = '1:1' | '16:9' | '9:16' | '4:3' | '3:4' | '21:9' | '9:21' | '3:2' | '2:3';

export type ImageStyle =
  | 'photorealistic'
  | 'watercolor'
  | 'oil-painting'
  | 'anime'
  | 'sketch'
  | 'digital-art'
  | '3d-render'
  | 'pixel-art'
  | 'minimalist'
  | 'abstract';

export type DiagramType =
  | 'flowchart'
  | 'sequence'
  | 'architecture'
  | 'network'
  | 'erd'
  | 'mindmap';

export type ImageFormat = 'png' | 'jpg' | 'jpeg' | 'webp';

export interface ImageProcessingOptions {
  format?: ImageFormat;
  quality?: number;
  resize?: {
    width?: number;
    height?: number;
  };
}

export interface GenerateOptions extends ImageProcessingOptions {
  prompt: string;
  count?: number;
  style?: ImageStyle;
  aspectRatio?: AspectRatio;
  variations?: boolean;
  output?: string;
  seed?: number;
}

export interface EditOptions extends ImageProcessingOptions {
  input: string;
  prompt: string;
  output?: string;
  mask?: string;
  operation?: 'add' | 'remove' | 'modify';
}

export interface RestoreOptions {
  input: string;
  output?: string;
  quality?: 'low' | 'medium' | 'high';
  denoise?: boolean;
  format?: ImageFormat;
  imageQuality?: number;
  resize?: {
    width?: number;
    height?: number;
  };
}

export interface IconOptions extends ImageProcessingOptions {
  prompt: string;
  sizes?: number[];
  padding?: number;
  output?: string;
}

export interface PatternOptions extends ImageProcessingOptions {
  prompt: string;
  tileable?: boolean;
  density?: 'low' | 'medium' | 'high';
  colors?: string[];
  output?: string;
}

export interface StoryOptions extends ImageProcessingOptions {
  prompt: string;
  scenes: number;
  styleConsistency?: boolean;
  aspectRatio?: AspectRatio;
  output?: string;
}

export interface DiagramOptions extends ImageProcessingOptions {
  prompt: string;
  type?: DiagramType;
  output?: string;
  labeled?: boolean;
}

export interface GeminiClientConfig {
  apiKey: string;
  model?: string;
}

export interface ImageGenerationResult {
  imagePath: string;
  metadata?: {
    prompt: string;
    model: string;
    timestamp: string;
    seed?: number;
  };
}
