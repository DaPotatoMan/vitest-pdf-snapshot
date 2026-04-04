PDF visual snapshot matcher for Vitest

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

await expect(buffer).toMatchPDFSnapshot({
  // Required for buffer input
  // Outputs to __snapshots__/images/visual.png
  name: `images/visual`
})
```

## License

MIT
