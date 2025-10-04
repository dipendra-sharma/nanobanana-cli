# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**nanobanana-cli** is an AI-powered image generation CLI using Google's Gemini API (specifically `gemini-2.5-flash-image` model). Built with Bun and TypeScript, it provides 8 specialized commands for generating, editing, and enhancing images via natural language.

## Development Commands

### Setup
```bash
# Install dependencies
bun install

# Set API key (required)
export GEMINI_API_KEY=your_api_key_here
# Or create .env file from .env.example
```

### Development
```bash
# Run commands in dev mode
bun run dev [command] [args]

# Examples:
bun run dev generate "sunset landscape"
bun run dev edit image.png "add rainbow"
bun run dev icon "rocket logo" --sizes 64,128,256
```

### Build & Test
```bash
# Type check
bun run typecheck

# Build for production
bun run build

# Run production build
bun run start [command] [args]
```

### Pre-publish
```bash
# Runs typecheck + build automatically
bun run prepublishOnly
```

## Architecture

### Core Components

**CLI Entry Point** (`src/index.ts`)
- Commander.js-based CLI with 8 commands + natural language interface
- Validates API key presence before execution (except for --help/--version)
- All commands support image processing options: `--format`, `--quality`, `--resize`

**Gemini Client** (`src/lib/gemini-client.ts`)
- Wraps `@google/genai` SDK
- Model: `gemini-2.5-flash-image` (configurable)
- `generateImages()`: Sequential image generation, validates base64 response
- `editImage()`: Takes input image + prompt, optional mask
- Handles both `inlineData.data` and text-based base64 responses

**File Handler** (`src/lib/file-handler.ts`)
- Manages `./output` directory (auto-created)
- Filename format: `{prefix}-{timestamp}-{index}.{ext}`
- Saves images with metadata JSON files
- Integrates ImageProcessor for format conversion/compression

**Image Processor** (`src/lib/image-processor.ts`)
- Uses Sharp library for high-performance processing
- Supports: PNG, JPG/JPEG, WebP formats
- Quality control (1-100)
- Resize with aspect ratio preservation (max 4096px)

**Prompt Builder** (`src/lib/prompt-builder.ts`)
- Enhances user prompts with style modifiers
- Command-specific prompt templates (icon, pattern, diagram, etc.)

### Command Implementations (`src/commands/`)

All commands follow similar patterns:
1. Validate inputs via `Validators`
2. Build enhanced prompt via `PromptBuilder`
3. Call `GeminiClient` methods
4. Process/save via `FileHandler` with processing options
5. Display spinner (ora) and logs (chalk)

**Commands:**
- `generate.ts`: Basic image generation with style/aspect ratio
- `edit.ts`: Modify existing images (add/remove/modify operations)
- `restore.ts`: Enhance/denoise images
- `icon.ts`: Generate multiple icon sizes
- `pattern.ts`: Create tileable patterns
- `story.ts`: Sequential scene generation
- `diagram.ts`: Technical diagrams (flowchart, architecture, etc.)
- `nl.ts`: Natural language fallback (infers intent)

### Utilities

**Config** (`src/utils/config.ts`)
- Singleton pattern for API key management
- Reads `GEMINI_API_KEY` or `GOOGLE_API_KEY` from env

**Logger** (`src/utils/logger.ts`)
- Chalk-based colored console output

**Validators** (`src/utils/validators.ts`)
- Input validation for prompts, counts, aspect ratios, etc.

## Key Patterns

### Image Processing Pipeline
All commands support optional post-processing:
```typescript
const processingOptions = {
  format: options.format,      // png|jpg|webp
  quality: options.quality,    // 1-100
  resize: options.resize,      // { width?, height? }
};
await fileHandler.saveImages(images, prefix, metadata, processingOptions);
```

### API Response Handling
Gemini responses may contain images as:
1. `part.inlineData.data` (preferred)
2. `part.text` (base64 string, validated)

Client validates base64 data (min 1000 chars, valid base64 regex).

### Environment Variables
- `GEMINI_API_KEY` or `GOOGLE_API_KEY` (required)
- `DEBUG=true` (optional, enables debug logging)

## TypeScript Configuration

- Module: ESNext with bundler resolution
- Path alias: `@/*` → `./src/*`
- Strict mode enabled
- Types: bun-types

## Package Manager

**Bun** is the exclusive runtime and package manager:
- Use `bun install` for dependencies
- Use `bun add <pkg>` to add packages
- Never use npm/yarn/pnpm

## Output Structure

```
output/
├── nb-generate-2025-10-04T14-30-15-1.png
├── nb-generate-2025-10-04T14-30-15-1.json  # metadata
├── nb-edit-2025-10-04T14-32-20.webp
└── nb-edit-2025-10-04T14-32-20.json
```

## Publishing

**Automated CI/CD via GitHub Actions:**
- `.github/workflows/ci.yml`: Type check + build on PR/push
- `.github/workflows/publish.yml`: **Automated npm publish triggered by version tags**

**IMPORTANT**: Publishing is fully automated. Do NOT run `npm publish` manually.

### Release Process:
```bash
# 1. Update version in package.json
# 2. Commit changes
git add package.json README.md
git commit -m "chore: release v0.x.x"

# 3. Create and push version tag (triggers auto-publish)
git tag v0.x.x
git push origin main
git push origin v0.x.x

# GitHub Actions will automatically:
# - Run typecheck and build
# - Publish to npm registry
# - Create GitHub release
```

**Never manually publish** - The CI pipeline handles everything when you push a version tag.

## Common Development Scenarios

**Adding a new command:**
1. Create `src/commands/{name}.ts` with command function
2. Define types in `src/types/index.ts` (e.g., `{Name}Options`)
3. Add command to `src/index.ts` using Commander pattern
4. Use `PromptBuilder` for prompt enhancement
5. Follow existing command patterns (validation → generation → save)

**Modifying image generation:**
- Main logic in `src/lib/gemini-client.ts`
- Prompt enhancement in `src/lib/prompt-builder.ts`
- Post-processing in `src/lib/image-processor.ts`

**Changing output formats:**
- Modify `ImageProcessor` class
- Update `ImageFormat` type
- Ensure Sharp supports the format

## Important Notes

- API key must be set in environment before running (except help/version)
- All images generated sequentially (not parallel) due to API limitations
- Base64 validation prevents empty/malformed responses
- Sharp library requires native dependencies (auto-installed by Bun)
- Output directory auto-created, git-ignored by default
