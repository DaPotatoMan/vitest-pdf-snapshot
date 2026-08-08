import type { MatcherState } from 'vitest'
import type { PDFInput, PDFSnapshotOptions } from './types.d.ts'
import { Buffer } from 'node:buffer'
import fs from 'node:fs/promises'
import path from 'node:path'
import sanitizePath from 'sanitize-filename'

/** Checks whether vitest snapshots are being updated */
export function isSnapshotUpdate(snapshotState: MatcherState['snapshotState']) {
  const state = snapshotState.snapshotUpdateState || (snapshotState as any)?._updateSnapshot
  return state === 'all'
}

export async function approveSnapshot(base: string, name: string) {
  const snapshot = path.join(base, `${name}.png`)
  const candidate = path.join(base, `${name}.new.png`)
  const diff = path.join(base, `${name}.diff.png`)

  try {
    await fs.copyFile(candidate, snapshot)
  }
  catch (error: any) {
    if (error.code === 'ENOENT')
      return false

    throw error
  }

  await Promise.all([
    fs.rm(candidate, { force: true }),
    fs.rm(diff, { force: true })
  ])

  return true
}

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

export async function ensureDir(...parts: string[]) {
  await fs.mkdir(path.join(...parts), { recursive: true })
}
