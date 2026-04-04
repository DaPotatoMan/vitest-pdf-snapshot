import type { Buffer } from 'node:buffer'
import type { CompareOptions } from 'pdf-visual-diff'
import 'vitest/node'

export type PDFInput = string | Buffer

export interface PDFSnapshotOptions extends CompareOptions {
  /**
   * Custom name for output snapshot (without extension)
   *
   * Can be used to place files under a different folder.
   *
   * @required when input is a Buffer
   *
   * @example
   * - `artifact` -> `__snapshots__/artifact.png`
   * - `images/artifact` -> `__snapshots__/images/artifact.png`
   */

  name?: string
}

declare module 'vitest' {
  interface Matchers<T = any> {
    toMatchPDFSnapshot: (options?: PDFSnapshotOptions) => Promise<void>
  }
}
