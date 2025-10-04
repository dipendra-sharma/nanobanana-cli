import type { ImageStyle, DiagramType } from '../types';

export class PromptBuilder {
  private static styleDescriptions: Record<ImageStyle, string> = {
    photorealistic: 'photorealistic, high detail, professional photography',
    watercolor: 'watercolor painting, soft colors, artistic brush strokes',
    'oil-painting': 'oil painting, thick brushstrokes, classical art style',
    anime: 'anime style, vibrant colors, Japanese animation aesthetic',
    sketch: 'pencil sketch, hand-drawn, artistic linework',
    'digital-art': 'digital art, modern illustration, clean lines',
    '3d-render': '3D rendered, CGI, realistic lighting and materials',
    'pixel-art': 'pixel art, retro game style, 8-bit or 16-bit aesthetic',
    minimalist: 'minimalist design, simple shapes, limited color palette',
    abstract: 'abstract art, non-representational, creative composition',
  };

  private static diagramDescriptions: Record<DiagramType, string> = {
    flowchart: 'flowchart diagram with boxes, arrows, and decision points',
    sequence: 'sequence diagram showing interactions and timeline',
    architecture: 'system architecture diagram with components and connections',
    network: 'network diagram showing nodes, connections, and topology',
    erd: 'entity relationship diagram with tables and relationships',
    mindmap: 'mind map with central concept and branching ideas',
  };

  static buildGeneratePrompt(basePrompt: string, style?: ImageStyle): string {
    if (!style) {
      return basePrompt;
    }

    const styleDesc = this.styleDescriptions[style];
    return `${basePrompt}, ${styleDesc}`;
  }

  static buildEditPrompt(basePrompt: string, operation?: string): string {
    if (!operation) {
      return basePrompt;
    }

    const operationPrefix = {
      add: 'Add to the image:',
      remove: 'Remove from the image:',
      modify: 'Modify the image:',
    }[operation] || '';

    return operationPrefix ? `${operationPrefix} ${basePrompt}` : basePrompt;
  }

  static buildRestorePrompt(): string {
    return 'Restore and enhance this image. Improve quality, reduce noise, fix artifacts, and enhance details while preserving the original content and composition.';
  }

  static buildIconPrompt(basePrompt: string, size: number): string {
    return `${basePrompt}, simple icon design, clean lines, professional, suitable for ${size}x${size}px, centered, transparent or white background`;
  }

  static buildPatternPrompt(
    basePrompt: string,
    tileable: boolean,
    density?: string,
    colors?: string[]
  ): string {
    let prompt = basePrompt;

    if (tileable) {
      prompt += ', seamless pattern, perfectly tileable, repeating design';
    }

    if (density) {
      const densityDesc = {
        low: 'sparse, minimal elements, lots of space',
        medium: 'balanced density, moderate spacing',
        high: 'dense pattern, tightly packed elements',
      }[density];
      if (densityDesc) prompt += `, ${densityDesc}`;
    }

    if (colors && colors.length > 0) {
      prompt += `, color palette: ${colors.join(', ')}`;
    }

    return prompt;
  }

  static buildStoryPrompts(basePrompt: string, scenes: number): string[] {
    const prompts: string[] = [];

    for (let i = 0; i < scenes; i++) {
      const sceneNumber = i + 1;
      const totalScenes = scenes;

      prompts.push(
        `${basePrompt} - Scene ${sceneNumber} of ${totalScenes}. Consistent art style and characters throughout all scenes.`
      );
    }

    return prompts;
  }

  static buildDiagramPrompt(basePrompt: string, type?: DiagramType, labeled?: boolean): string {
    let prompt = basePrompt;

    if (type) {
      const typeDesc = this.diagramDescriptions[type];
      prompt = `${typeDesc}: ${prompt}`;
    } else {
      prompt = `Technical diagram: ${prompt}`;
    }

    if (labeled) {
      prompt += ', with clear labels and annotations';
    }

    prompt += ', professional, clean design, easy to understand';

    return prompt;
  }

  static buildNegativePrompt(unwantedElements?: string[]): string {
    const defaultUnwanted = [
      'blurry',
      'low quality',
      'distorted',
      'watermark',
      'text',
    ];

    const elements = unwantedElements
      ? [...defaultUnwanted, ...unwantedElements]
      : defaultUnwanted;

    return elements.join(', ');
  }
}
