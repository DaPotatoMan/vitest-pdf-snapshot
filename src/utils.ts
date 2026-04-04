import type { MatcherState } from 'vitest'
import type { PDFInput, PDFSnapshotOptions } from './types.d.ts'
import { Buffer } from 'node:buffer'
import path from 'node:path'
import sanitizePath from 'sanitize-filename'

/** Parses name of snapshot */
export function getSnapshotName(state: MatcherState, input: PDFInput, options: PDFSnapshotOptions) {
  if (options.name)
    return options.name

  let name: string

  // Path based input
  if (typeof input === 'string') {
    const meta = path.parse(input)
    name = `${state.currentTestName} : ${meta.name}`
  }

  // Buffer based
  else if (Buffer.isBuffer(input)) {
    throw new TypeError('options.name must be provided for Buffer inputs')
  }

  // Unsupported
  else {
    throw new TypeError('Unsupported input was provided')
  }

  return sanitizePath(name, { replacement: '-' }).toLowerCase()
}
