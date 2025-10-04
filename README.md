# nb (nanobanana)

AI-powered image generation CLI using Google's Gemini API. Create, edit, and enhance images using natural language.

## Features

### Core Commands
- **Generate** - Create images from text prompts with style variations
- **Edit** - Modify existing images with natural language instructions
- **Restore** - Enhance and restore old or low-quality images
- **Icon** - Generate app icons in multiple sizes
- **Pattern** - Create seamless patterns and textures
- **Story** - Generate sequential images for visual storytelling
- **Diagram** - Create technical diagrams and flowcharts
- **Natural Language** - Flexible interface for any image generation task

### Image Processing
- **WebP Conversion** - Convert output to WebP format for smaller file sizes
- **Compression** - Adjust image quality (1-100) for optimal file size
- **Resize** - Resize images to specific dimensions (e.g., 512x512)

## Installation

```bash
bun install
```

## Setup

1. Get your Gemini API key from [Google AI Studio](https://aistudio.google.com/app/apikey)

2. Set your API key as an environment variable:

```bash
export GEMINI_API_KEY=your_api_key_here
```

Or create a `.env` file:

```bash
cp .env.example .env
# Edit .env and add your API key
```

## Usage

### Generate Images

Create images from text prompts:

```bash
# Basic generation
bun run dev generate "sunset over mountains"

# Multiple images
bun run dev generate "futuristic city" --count 4

# With style
bun run dev generate "forest landscape" --style watercolor

# Custom aspect ratio
bun run dev generate "portrait of a cat" --aspect-ratio 9:16

# All options
bun run dev generate "cyberpunk street scene" \
  --count 3 \
  --style digital-art \
  --aspect-ratio 16:9 \
  --seed 42 \
  --output ./my-images

# With image processing
bun run dev generate "mountain landscape" \
  --format webp \
  --quality 75 \
  --resize 512x512
```

**Styles:** `photorealistic`, `watercolor`, `oil-painting`, `anime`, `sketch`, `digital-art`, `3d-render`, `pixel-art`, `minimalist`, `abstract`

**Aspect Ratios:** `1:1`, `16:9`, `9:16`, `4:3`, `3:4`, `21:9`, `9:21`, `3:2`, `2:3`

**Image Processing Options (available on all commands):**
- `--format <format>` - Output format: `png`, `jpg`, `webp` (default: png)
- `--quality <number>` - Image quality 1-100 (default: 90)
- `--resize <size>` - Resize to dimensions like `512x512` or `1024x768`

### Edit Images

Modify existing images:

```bash
# Add elements
bun run dev edit image.png "add a rainbow in the sky" --operation add

# Remove elements
bun run dev edit photo.jpg "remove the person" --operation remove

# Modify style
bun run dev edit picture.png "make it look like a watercolor painting"

# With mask
bun run dev edit input.png "change the background" --mask mask.png

# Save as WebP with compression
bun run dev edit photo.jpg "make it vintage" --format webp --quality 80
```

### Restore Images

Enhance and restore images:

```bash
# Basic restoration
bun run dev restore old-photo.jpg

# High quality enhancement
bun run dev restore image.png --quality high

# Focus on noise reduction
bun run dev restore noisy.jpg --denoise

# Restore and convert to WebP
bun run dev restore old-photo.jpg --format webp --image-quality 85
```

### Generate Icons

Create icons in multiple sizes:

```bash
# Generate standard icon sizes
bun run dev icon "coffee cup logo"

# Custom sizes
bun run dev icon "app icon" --sizes 64,128,256,512

# All sizes
bun run dev icon "rocket ship" --sizes 16,32,64,128,256,512,1024

# Generate WebP icons
bun run dev icon "app logo" --sizes 128,256,512 --format webp --quality 85
```

### Create Patterns

Generate seamless patterns:

```bash
# Basic pattern
bun run dev pattern "geometric hexagons"

# With color palette
bun run dev pattern "floral design" --colors "pink,lavender,white"

# Control density
bun run dev pattern "stars" --density high

# Non-tileable
bun run dev pattern "abstract waves" --tileable false
```

### Generate Stories

Create sequential images:

```bash
# 4-scene story
bun run dev story "a seed growing into a tree" --scenes 4

# Custom aspect ratio
bun run dev story "day to night transition" --scenes 5 --aspect-ratio 21:9

# Cinematic story
bun run dev story "hero's journey" --scenes 6 --aspect-ratio 16:9
```

### Create Diagrams

Generate technical diagrams:

```bash
# Flowchart
bun run dev diagram "user authentication flow" --type flowchart

# Architecture diagram
bun run dev diagram "microservices architecture" --type architecture

# Network diagram
bun run dev diagram "home network setup" --type network

# Other types: sequence, erd, mindmap
bun run dev diagram "database schema for e-commerce" --type erd
```

### Natural Language Interface

Use natural language for any task:

```bash
# Simple generation
bun run dev "create a beautiful sunset"

# Multiple images
bun run dev "futuristic robot" --count 3

# Complex requests
bun run dev "photorealistic image of a mountain landscape at golden hour"
```

## Output

All generated images are saved to `./output` by default (customizable with `-o` flag).

Each image includes:
- Image file in your chosen format (PNG, JPG, or WebP)
- Metadata JSON file with prompt, model, timestamp, and parameters

### Image Processing Benefits

**WebP Format:**
- 25-35% smaller file sizes compared to PNG
- Excellent quality retention
- Perfect for web use

**Example file sizes:**
- Original PNG (1024x1024): ~1.0 MB
- WebP quality 75 (512x512): ~27 KB (97% smaller!)
- JPG quality 80: ~100 KB

**Use Cases:**
- `--format webp --quality 75` - Web images, fast loading
- `--format jpg --quality 85` - Photos, balanced quality
- `--format png --quality 90` - High quality, lossless
- `--resize 512x512` - Thumbnails, previews, social media

## Development

```bash
# Run in development mode
bun run dev [command]

# Build for production
bun run build

# Run production build
bun run start

# Type check
bun run typecheck
```

## Publishing to npm

```bash
# Login to npm (one-time setup)
bun login

# Publish to npm
bun publish --access public
```

## Project Structure

```
nb/
├── src/
│   ├── commands/       # Command implementations
│   ├── lib/           # Core libraries (Gemini client, file handler, etc.)
│   ├── types/         # TypeScript type definitions
│   ├── utils/         # Utilities (config, logger, validators)
│   └── index.ts       # CLI entry point
├── output/            # Generated images (created automatically)
├── package.json
└── tsconfig.json
```

## API Models

This CLI uses:
- **Gemini 2.5 Flash Image** (gemini-2.5-flash-image) - For image generation and editing

## Dependencies

### Runtime
- **Bun** - Fast TypeScript runtime
- **@google/genai** - Official Google Gen AI SDK for Gemini API
- **sharp** - High-performance image processing (WebP, resize, compression)
- **Commander.js** - CLI framework
- **ora** - Terminal spinners
- **chalk** - Terminal styling

### Image Processing
The Sharp library enables advanced image processing:
- Format conversion (PNG, JPG, WebP)
- Quality compression (1-100)
- Resizing with aspect ratio preservation
- Optimized for performance using libvips

## License

MIT

## Acknowledgements

This project was inspired by and builds upon the excellent [nanobanana](https://github.com/gemini-cli-extensions/nanobanana) Gemini CLI extension by the Gemini CLI Extensions community. Many thanks to the original creators for pioneering AI-powered image generation in the command line.

This CLI tool was developed with assistance from [Claude Code](https://claude.com/claude-code), Anthropic's AI-powered coding assistant, which helped accelerate development and ensure best practices.

## Credits

Built with:
- [Bun](https://bun.sh) - Fast TypeScript runtime
- [Google Gen AI SDK](https://www.npmjs.com/package/@google/genai) - Gemini API client
- [Sharp](https://sharp.pixelplumbing.com/) - High-performance image processing
- [Commander.js](https://github.com/tj/commander.js) - CLI framework
- [Ora](https://github.com/sindresorhus/ora) - Terminal spinners
- [Chalk](https://github.com/chalk/chalk) - Terminal styling
