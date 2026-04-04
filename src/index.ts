import type { CompareOptions } from 'pdf-visual-diff'

import fs from 'node:fs'
import { dirname, join } from 'node:path'
import { glob } from 'glob'
import { comparePdfToSnapshot } from 'pdf-visual-diff'

import { expect } from 'vitest'

async function approveSnapshots(cwd: string, name: string) {
  const snapshotDir = join(cwd, '__snapshots__')
  const files = await glob(`${snapshotDir}/${name}?(.new|.diff).png`)

  for (const file of files)
    fs.rmSync(file)
}

expect.extend({
  async  toMatchPDFSnapshot(
    pdf: string,
    options?: CompareOptions
  ) {
    // @ts-expect-error vitest internal api
    const isUpdating = this.snapshotState._updateSnapshot === 'all'
    const { isNot, testPath, currentTestName } = this

    if (isNot)
      throw new Error('`.not` cannot be used with `.toMatchPDFSnapshot()`')

    if (!currentTestName)
      throw new Error('currentTestName not found')

    if (!testPath)
      throw new Error('testPath not found')

    if (!fs.existsSync(pdf))
      throw new Error(`PDF does not exist at path: ${pdf}`)

    const cwd = dirname(testPath)
    const snapshotName = currentTestName
      .trim()
      .replace(' > ', '.')
      .replace(/ /g, '_')

    // Approve conflicting snapshots
    if (isUpdating)
      await approveSnapshots(cwd, snapshotName)

    const pass = await comparePdfToSnapshot(pdf, cwd, snapshotName, options)

    return {
      pass,
      message: () => 'Does not match with snapshot. Press u to update snapshots'
    }
  }
})
