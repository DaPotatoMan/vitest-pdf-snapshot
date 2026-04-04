import type { CompareOptions } from 'pdf-visual-diff'
import 'vitest/node'

declare module 'vitest' {
  interface Matchers<T = any> {
    toMatchPDFSnapshot: (options?: CompareOptions) => Promise<void>
  }
}
