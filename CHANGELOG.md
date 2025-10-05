# Changelog

All notable changes to nanobanana-cli will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.0] - 2025-10-05

### Breaking Changes
- **Removed `--resize` option** - Resize functionality has been completely removed from all commands. Images are now generated at sizes determined by their aspect ratio (e.g., 1:1 = 1024x1024, 16:9 = 1344x768).
- **Renamed `--count` to `--num-images`** - The parameter for generating multiple images has been renamed from `--count` to `--num-images` to avoid Commander.js conflicts.
- **Updated aspect ratio support** - Removed non-working aspect ratios (3:4, 4:5, 9:21). Now supports 8 aspect ratios: 1:1, 2:3, 3:2, 4:3, 5:4, 9:16, 16:9, 21:9.

### Added
- Aspect ratio validation now only includes verified working ratios
- Count validation added to natural language and story commands
- Better error messages for aspect ratio validation

### Changed
- **Upgraded @google/genai** from v0.3.1 to v1.22.0
- Fixed aspect ratio functionality - aspect ratios now work correctly by passing `imageConfig.aspectRatio` to the Gemini API
- Image processor now only handles format conversion (PNG, JPG, WebP) and quality settings
- File handler updated to remove resize-related logic

### Fixed
- Aspect ratios were not being applied (all images were 1024x1024) - now fixed
- Count parameter was not working in generate command - fixed by renaming to --num-images
- Icon command no longer attempts to resize (generates at 1024x1024 regardless of requested size)

## [0.1.4] - 2025-10-04

### Fixed
- Added `-v` flag alias for version command
- Synced version flag with package.json version

## [0.1.2] - 2025-10-03

### Changed
- Updated README with minimal emojis for better readability
- Improved documentation clarity

## [0.1.1] - 2025-10-03

### Changed
- Rewrote README with user-focused approach
- Improved command examples and use cases
- Enhanced documentation structure

## [0.1.0] - 2025-10-02

### Added
- Initial release of nanobanana-cli
- 8 specialized commands: generate, edit, restore, icon, pattern, story, diagram, natural language
- Support for multiple image formats (PNG, JPG, WebP)
- Image processing with Sharp library
- Quality and resize options
- Multiple aspect ratios support
- 10+ art styles
- Gemini 2.5 Flash Image model integration
- Automatic metadata saving
- CLI built with Commander.js and Bun

[0.2.0]: https://github.com/dipendra-sharma/nanobanana-cli/compare/v0.1.4...v0.2.0
[0.1.4]: https://github.com/dipendra-sharma/nanobanana-cli/compare/v0.1.2...v0.1.4
[0.1.2]: https://github.com/dipendra-sharma/nanobanana-cli/compare/v0.1.1...v0.1.2
[0.1.1]: https://github.com/dipendra-sharma/nanobanana-cli/compare/v0.1.0...v0.1.1
[0.1.0]: https://github.com/dipendra-sharma/nanobanana-cli/releases/tag/v0.1.0
