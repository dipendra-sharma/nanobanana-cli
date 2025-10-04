export class Config {
  private static instance: Config;
  private apiKey: string | undefined;

  private constructor() {
    this.apiKey = this.loadApiKey();
  }

  static getInstance(): Config {
    if (!Config.instance) {
      Config.instance = new Config();
    }
    return Config.instance;
  }

  private loadApiKey(): string | undefined {
    return process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  }

  getApiKey(): string {
    if (!this.apiKey) {
      throw new Error(
        'API key not found. Please set GEMINI_API_KEY or GOOGLE_API_KEY environment variable.'
      );
    }
    return this.apiKey;
  }

  hasApiKey(): boolean {
    return !!this.apiKey;
  }
}

export const config = Config.getInstance();
