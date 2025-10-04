# nb (nanobanana)

> **Free AI-powered image generation from your terminal**
>
> Generate, edit, and enhance images using Google's Gemini API with simple natural language commands.

[![npm version](https://img.shields.io/npm/v/nanobanana-cli.svg)](https://www.npmjs.com/package/nanobanana-cli)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Powered by Gemini](https://img.shields.io/badge/Powered%20by-Google%20Gemini-blue.svg)](https://ai.google.dev/)

---

## Why nb?

- **Free to Use** - Leverage Google's Gemini API (free tier available)
- **Lightning Fast** - Powered by Gemini 2.5 Flash Image model
- **8 Specialized Commands** - Generate, edit, restore, icons, patterns, stories, diagrams, and more
- **Smart Image Processing** - Built-in WebP conversion, compression, and resizing
- **Natural Language** - Just describe what you want in plain English
- **10+ Art Styles** - Photorealistic, watercolor, anime, pixel-art, and more
- **Multiple Aspect Ratios** - Perfect for any use case from social media to print
- **Zero Config** - Just add your API key and start creating

---

## Quick Start

### Try it instantly (no installation required)

```bash
# Generate your first AI image in seconds
npx nanobanana-cli generate "sunset over mountains"
```

### Install globally for faster access

```bash
# Using npm
npm install -g nanobanana-cli

# Using Bun (recommended)
bun install -g nanobanana-cli

# Then use the short command
nb generate "cyberpunk city at night"
```

---

## Installation & Setup

### 1. Get Your Free Gemini API Key

Visit [Google AI Studio](https://aistudio.google.com/app/apikey) and get your free API key (no credit card required).

### 2. Set Your API Key

```bash
# On macOS/Linux
export GEMINI_API_KEY=your_api_key_here

# On Windows (PowerShell)
$env:GEMINI_API_KEY="your_api_key_here"

# Or add to your shell profile (~/.bashrc, ~/.zshrc, etc.)
echo 'export GEMINI_API_KEY=your_api_key_here' >> ~/.zshrc
```

### 3. Create Your First Image

```bash
nb generate "a majestic dragon flying over a castle"
```

Your image will be saved in the `./output` folder automatically!

---

## Commands & Examples

### Generate Images

Create stunning AI images from text descriptions with style options and aspect ratios.

```bash
# Basic image generation
nb generate "sunset over mountains"

# Generate multiple images at once
nb generate "futuristic robot" --count 4

# Apply artistic styles
nb generate "forest landscape" --style watercolor
nb generate "city street" --style anime
nb generate "portrait" --style photorealistic

# Custom aspect ratios for different platforms
nb generate "mobile wallpaper" --aspect-ratio 9:16
nb generate "youtube thumbnail" --aspect-ratio 16:9
nb generate "instagram post" --aspect-ratio 1:1

# Advanced: combine all options
nb generate "cyberpunk street scene at night" \
  --count 3 \
  --style digital-art \
  --aspect-ratio 16:9 \
  --format webp \
  --quality 85
```

**Available Styles:**
`photorealistic`, `watercolor`, `oil-painting`, `anime`, `sketch`, `digital-art`, `3d-render`, `pixel-art`, `minimalist`, `abstract`

**Aspect Ratios:**
`1:1`, `16:9`, `9:16`, `4:3`, `3:4`, `21:9`, `9:21`, `3:2`, `2:3`

---

### Edit Images

Transform existing images with natural language instructions.

```bash
# Add elements to images
nb edit photo.jpg "add a rainbow in the sky"
nb edit landscape.png "add snow to the mountains"

# Remove unwanted elements
nb edit photo.jpg "remove the person in the background"
nb edit image.png "remove watermark"

# Change image style
nb edit photo.jpg "make it look like a watercolor painting"
nb edit portrait.png "convert to black and white with vintage film grain"

# Advanced editing with masks
nb edit input.png "change the sky to sunset" --mask sky-mask.png

# Save optimized for web
nb edit photo.jpg "enhance colors and contrast" \
  --format webp \
  --quality 80 \
  --resize 1920x1080
```

---

### Restore & Enhance Images

Bring old or low-quality images back to life.

```bash
# Basic image restoration
nb restore old-photo.jpg

# High-quality enhancement
nb restore vintage-photo.jpg --quality high

# Denoise and enhance
nb restore noisy-image.png --denoise

# Restore and optimize
nb restore old-picture.jpg \
  --quality high \
  --format webp \
  --image-quality 90
```

---

### Generate App Icons

Create professional app icons in multiple sizes instantly.

```bash
# Standard icon set
nb icon "minimalist rocket logo"

# Custom sizes
nb icon "coffee cup app icon" --sizes 64,128,256,512

# All common sizes
nb icon "music note logo" --sizes 16,32,64,128,256,512,1024

# Generate as WebP for modern platforms
nb icon "mountain peak logo" \
  --sizes 128,256,512 \
  --format webp \
  --quality 90
```

Perfect for: iOS apps, Android apps, web favicons, PWAs

---

### Create Seamless Patterns

Generate tileable patterns and textures for backgrounds and designs.

```bash
# Simple pattern
nb pattern "geometric hexagons"

# Custom color palette
nb pattern "floral design" --colors "pink,lavender,white"

# Control pattern density
nb pattern "stars and moons" --density high
nb pattern "subtle dots" --density low

# Non-tileable backgrounds
nb pattern "abstract watercolor splash" --tileable false

# Web-optimized pattern
nb pattern "circuit board design" \
  --colors "green,black" \
  --format webp \
  --quality 75 \
  --resize 512x512
```

Great for: Website backgrounds, textile design, game assets, social media

---

### Visual Storytelling

Generate sequential images for comics, storyboards, or presentations.

```bash
# 4-scene story
nb story "a seed growing into a blooming flower"

# Custom scene count
nb story "day to night transition over a city" --scenes 6

# Cinematic widescreen
nb story "hero's journey through mystical lands" \
  --scenes 5 \
  --aspect-ratio 21:9

# Instagram story format
nb story "morning coffee routine" \
  --scenes 4 \
  --aspect-ratio 9:16
```

Perfect for: Storyboards, comics, presentations, social media stories

---

### Technical Diagrams

Create diagrams, flowcharts, and technical visualizations.

```bash
# Flowcharts
nb diagram "user authentication flow" --type flowchart
nb diagram "checkout process with payment gateway" --type flowchart

# Architecture diagrams
nb diagram "microservices architecture with API gateway" --type architecture
nb diagram "cloud infrastructure on AWS" --type architecture

# Network diagrams
nb diagram "home office network setup" --type network

# Database schemas
nb diagram "e-commerce database schema" --type erd

# Mind maps
nb diagram "project planning brainstorm" --type mindmap

# Sequence diagrams
nb diagram "API request response cycle" --type sequence
```

**Diagram Types:** `flowchart`, `sequence`, `architecture`, `network`, `erd`, `mindmap`

Perfect for: Documentation, presentations, planning, teaching

---

### Natural Language Interface

Can't remember the exact command? Just describe what you want!

```bash
# The AI will figure out the best approach
nb "create a beautiful sunset landscape"
nb "make a logo with a rocket ship"
nb "generate 3 images of a futuristic robot"
nb "photorealistic mountain scenery at golden hour"
```

---

## Real-World Use Cases

### For Content Creators
- **Blog Graphics**: `nb generate "modern minimalist blog header" --aspect-ratio 21:9`
- **Social Media**: `nb generate "engaging instagram post about coffee" --aspect-ratio 1:1`
- **YouTube Thumbnails**: `nb generate "exciting tech review thumbnail" --aspect-ratio 16:9`

### For Developers
- **App Icons**: `nb icon "clean todo app icon" --sizes 256,512,1024`
- **Placeholder Images**: `nb generate "user avatar placeholder" --count 10`
- **UI Mockups**: `nb generate "modern dashboard interface" --style minimalist`

### For Designers
- **Concept Art**: `nb generate "sci-fi vehicle design" --style digital-art --count 5`
- **Patterns**: `nb pattern "art deco geometric" --colors "gold,black,white"`
- **Mood Boards**: `nb generate "cozy cafe interior" --count 6 --style photorealistic`

### For Educators
- **Diagrams**: `nb diagram "water cycle" --type flowchart`
- **Visual Aids**: `nb generate "ancient Roman architecture" --style photorealistic`
- **Storyboards**: `nb story "photosynthesis process" --scenes 4`

---

## Image Processing Options

All commands support advanced image processing for optimal file sizes and quality.

### Format Conversion

```bash
# WebP (smallest, best for web)
nb generate "landscape" --format webp --quality 75

# JPEG (balanced)
nb generate "portrait" --format jpg --quality 85

# PNG (lossless, largest)
nb generate "logo" --format png --quality 90
```

### Resize Images

```bash
# Resize to specific dimensions
nb generate "wallpaper" --resize 1920x1080

# Social media optimized
nb generate "instagram post" --resize 1080x1080 --format webp --quality 80

# Thumbnail generation
nb generate "product photo" --resize 512x512 --format jpg --quality 75
```

### File Size Examples

- **Original PNG** (1024x1024): ~1.0 MB
- **WebP Quality 75** (512x512): ~27 KB (97% smaller!)
- **JPEG Quality 80** (1024x1024): ~100 KB

---

## Output & Metadata

All generated images are automatically saved to `./output` (customizable with `-o` flag).

Each image includes:
- **Image file**: PNG, JPG, or WebP format
- **Metadata JSON**: Contains prompt, model info, timestamp, and generation parameters

```
output/
├── nb-generate-2025-10-04T14-30-15-1.png
├── nb-generate-2025-10-04T14-30-15-1.json
├── nb-edit-2025-10-04T14-32-20.webp
└── nb-edit-2025-10-04T14-32-20.json
```

Customize output directory:
```bash
nb generate "logo" --output ./my-images
```

---

## Pro Tips & Tricks

### Batch Generation
```bash
# Generate multiple variations
nb generate "logo concept" --count 10 --variations
```

### Consistent Results
```bash
# Use seed for reproducible images
nb generate "character design" --seed 42
```

### Web Optimization
```bash
# Perfect for web - small size, high quality
nb generate "hero image" \
  --format webp \
  --quality 75 \
  --resize 1920x1080
```

### Creative Prompts
```bash
# Be specific for better results
nb generate "a serene Japanese garden with cherry blossoms, koi pond, and stone lanterns at sunset, photorealistic, high detail"

# Combine styles
nb generate "cyberpunk samurai" --style "digital-art"
```

---

## FAQ

**Q: Is Gemini API really free?**

A: Yes! Google offers a generous free tier for the Gemini API. Perfect for personal projects and testing.

**Q: What image sizes can I generate?**

A: The default size is 1024x1024, but you can resize to any dimension up to 4096x4096 using the `--resize` flag.

**Q: Can I use generated images commercially?**

A: Check [Google's Gemini API Terms of Service](https://ai.google.dev/terms) for the latest usage guidelines.

**Q: How do I update to the latest version?**

A: Run `npm update -g nanobanana-cli` or `bun update -g nanobanana-cli`

**Q: Where are my images saved?**

A: By default in `./output` folder. Use `-o` flag to change the location.

**Q: Can I use this without installing?**

A: Yes! Use `npx nanobanana-cli [command]` to run without global installation.

---

## Troubleshooting

### API Key Not Found
```bash
# Make sure your API key is set
echo $GEMINI_API_KEY

# If empty, set it again
export GEMINI_API_KEY=your_api_key_here
```

### Images Not Generating
- Check your API key is valid at [Google AI Studio](https://aistudio.google.com/app/apikey)
- Verify you haven't exceeded free tier limits
- Try a simpler prompt first

### Command Not Found
```bash
# If 'nb' command not found after global install
npm list -g nanobanana-cli

# Try reinstalling
npm install -g nanobanana-cli --force
```

### Sharp Library Errors (macOS M1/M2)
```bash
# Reinstall sharp with native bindings
npm rebuild sharp
```

---

## Contributing

We welcome contributions! Here's how you can help:

- Report bugs at [GitHub Issues](https://github.com/dipendra-sharma/nanobanana-cli/issues)
- Suggest features or improvements
- Improve documentation
- Star the repo if you find it useful!

---

## License

MIT © [Dipendra Sharma](https://github.com/dipendra-sharma)

---

## Acknowledgements

This project was inspired by [nanobanana](https://github.com/gemini-cli-extensions/nanobanana) by the Gemini CLI Extensions community.

Developed with assistance from [Claude Code](https://claude.com/claude-code), Anthropic's AI-powered coding assistant.

**Built with:**
- [Google Gemini API](https://ai.google.dev/) - AI image generation
- [Bun](https://bun.sh) - Fast TypeScript runtime
- [Sharp](https://sharp.pixelplumbing.com/) - High-performance image processing
- [Commander.js](https://github.com/tj/commander.js) - CLI framework

---

## Show Your Support

If you find **nb** useful, please:
- Star this repo on [GitHub](https://github.com/dipendra-sharma/nanobanana-cli)
- Share it on [npm](https://www.npmjs.com/package/nanobanana-cli)
- Tweet about it
- Tell your friends!

---

**Made with care for developers, designers, and creators**

[Report Bug](https://github.com/dipendra-sharma/nanobanana-cli/issues) · [Request Feature](https://github.com/dipendra-sharma/nanobanana-cli/issues) · [Documentation](https://github.com/dipendra-sharma/nanobanana-cli#readme)
