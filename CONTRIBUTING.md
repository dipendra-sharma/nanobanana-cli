# Contributing to nanobanana-cli

Thanks for your interest in contributing!

## Reporting Issues

Found a bug or have a feature request? Please open an issue with:
- Clear description
- Steps to reproduce (for bugs)
- Your environment (OS, Bun version)

## Pull Requests

1. Fork the repository
2. Create a branch: `git checkout -b my-feature`
3. Make your changes
4. Run checks: `bun run typecheck && bun run build`
5. Commit: `git commit -m "feat: add new feature"`
6. Push and create a pull request

## Development

```bash
# Install dependencies
bun install

# Run in dev mode
bun run dev generate "test"

# Type check
bun run typecheck

# Build
bun run build
```

## Guidelines

- Follow existing code style
- Keep changes focused
- Add comments for complex logic
- Test your changes manually

## Questions?

Open an issue or discussion.

## License

By contributing, you agree your contributions will be licensed under MIT.
