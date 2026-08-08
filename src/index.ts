import type { PDFInput, PDFSnapshotOptions } from './types.d.ts'

import path from 'node:path'
import { comparePdfToSnapshot } from 'pdf-visual-diff'
import { expect } from 'vitest'
import { approveSnapshot, ensureDir, getSnapshotName, isSnapshotUpdate } from './utils.ts'

expect.extend({
  async toMatchPDFSnapshot(input: PDFInput, options: PDFSnapshotOptions = {}) {
    const isUpdating = isSnapshotUpdate(this.snapshotState)
    const { testPath } = this

    if (this.isNot)
      throw new Error('`.not` cannot be used with `.toMatchPDFSnapshot()`')

    if (!testPath)
      throw new Error('testPath not found')

    const cwd = path.dirname(testPath)
    const snapshotDir = path.join(cwd, '__snapshots__')
    const name = getSnapshotName(this, input, options)

    // Ensure the snapshot container is available
    await ensureDir(snapshotDir, path.dirname(name))

    let pass = await comparePdfToSnapshot(input, cwd, name, options)

    if (!pass && isUpdating)
      pass = await approveSnapshot(snapshotDir, name)

    return {
      pass,
      message: () => 'Does not match with snapshot. Press u to update snapshots'
    }
  }
})
