import type { PDFInput, PDFSnapshotOptions } from './types.d.ts'

import fs from 'node:fs'
import path from 'node:path'
import { glob } from 'glob'
import { comparePdfToSnapshot } from 'pdf-visual-diff'
import { expect } from 'vitest'
import { getSnapshotName } from './utils.ts'

async function approveSnapshots(base: string, name: string) {
  const files = await glob(`${base}/${name}?(.new|.diff).png`)

  // No diff files were created
  if (files.length <= 1)
    return

  for (const file of files)
    fs.rmSync(file)
}

expect.extend({
  async toMatchPDFSnapshot(input: PDFInput, options: PDFSnapshotOptions = {}) {
    // @ts-expect-error vitest internal api
    const isUpdating = this.snapshotState._updateSnapshot === 'all'
    const { testPath } = this

    if (this.isNot)
      throw new Error('`.not` cannot be used with `.toMatchPDFSnapshot()`')

    if (!testPath)
      throw new Error('testPath not found')

    const cwd = path.dirname(testPath)
    const snapshotDir = path.join(cwd, '__snapshots__')
    const name = getSnapshotName(this, input, options)

    // ! Ensure container dir is available
    fs.mkdirSync(`${snapshotDir}/${path.dirname(name)}`, { recursive: true })

    // Approve conflicting snapshots
    if (isUpdating)
      await approveSnapshots(snapshotDir, name)

    const pass = await comparePdfToSnapshot(input, cwd, name, options)

    return {
      pass,
      message: () => 'Does not match with snapshot. Press u to update snapshots'
    }
  }
})
