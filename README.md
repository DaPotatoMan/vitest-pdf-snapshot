# vitest-pdf-snapshot

A Vitest matcher for visual regression testing PDFs. It renders a PDF to an image and compares the result with a PNG snapshot stored beside the test.

## Install

```bash
pnpm add -D vitest-pdf-snapshot
```

`vitest` is a peer dependency and must already be installed in your project.

## Setup

Register the matcher once from a Vitest setup file:

```ts
// test/setup.ts
import 'vitest-pdf-snapshot'
```

Add that file to Vitest's `setupFiles`:

```ts
// vite.config.ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    setupFiles: ['./test/setup.ts'],
  },
})
```

## Usage

Pass either a path to a PDF or a `Buffer` to `toMatchPDFSnapshot`:

```ts
import { readFile } from 'node:fs/promises'
import { expect, it } from 'vitest'

it('renders the invoice', async () => {
  await expect('fixtures/invoice.pdf').toMatchPDFSnapshot()
})

it('renders an in-memory PDF', async () => {
  const pdf = await readFile('fixtures/invoice.pdf')

  await expect(pdf).toMatchPDFSnapshot({
    name: 'invoices/invoice',
  })
})
```

For a file path, the matcher derives the snapshot name from the test name and PDF filename. For a `Buffer`, `name` is required because there is no filename to derive one from.

Custom names are written without adding an extension. They may include directories:

```ts
await expect('fixtures/invoice.pdf').toMatchPDFSnapshot({
  // tests/__snapshots__/invoices/april.png
  name: 'invoices/april',
})
```

## Snapshots and updates

Snapshots are PNG files placed in a `__snapshots__` directory alongside the test file. A missing snapshot is created on the first successful run.

When a PDF differs, the matcher leaves these artifacts to help inspect the change:

```text
tests/
├── invoice.test.ts
└── __snapshots__/
    ├── renders-the-invoice---invoice.png
    ├── renders-the-invoice---invoice.new.png
    └── renders-the-invoice---invoice.diff.png
```

Review the `.new.png` and `.diff.png` files, then update snapshots with Vitest's update mode:

```bash
vitest --update
```

In watch mode, you can also press `u`. When the update is accepted, the matcher promotes the `.new.png` image to the baseline and removes the temporary `.new.png` and `.diff.png` files.

## Options

`toMatchPDFSnapshot` accepts the comparison options provided by `pdf-visual-diff`, plus `name`:

```ts
await expect('fixtures/invoice.pdf').toMatchPDFSnapshot({
  name: 'invoices/april',
  tolerance: 0.01,
})
```

Common comparison options include `tolerance`, `maskRegions`, `pdf2PngOptions`, and `failOnMissingSnapshot`. See [`pdf-visual-diff`](https://www.npmjs.com/package/pdf-visual-diff) for their full definitions.

## Limitations

- `.not.toMatchPDFSnapshot()` is not supported.

## License

MIT
