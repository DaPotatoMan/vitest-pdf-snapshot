# vitest-pdf-snapshot

A custom matcher for Vitest that lets you do visual regression testing on PDFs.

## Install

```bash
pnpm add vitest-pdf-snapshot
```

## Quick example

In your vitest setup file

```typescript
import 'vitest-pdf-snapshot'
```

In your code

```typescript
await expect(path).toMatchPDFSnapshot()
```

The first run creates a snapshot in `__snapshots__/test_name.png`. Subsequent runs compare against it.

## License

MIT
