import fs from 'node:fs'
import path from 'node:path'
import { getSnapshotName } from '../src/utils'

// Register PDF snapshot service
import '../src/index'

const pdf = path.resolve(__dirname, 'assets/sample.pdf')

it('works with path', () => expect(pdf).toMatchPDFSnapshot())

it('works with path / custom filename', async () => {
  await expect(pdf).toMatchPDFSnapshot({ name: 'custom-sample' })
  await expect(pdf).toMatchPDFSnapshot({ name: 'images/sample' })
})

it('works with Buffer', () => {
  const buffer = fs.readFileSync(pdf)

  return expect(buffer).toMatchPDFSnapshot({
    name: 'buffer-sample'
  })
})

it('throws for Buffer input without options.name', async () => {
  const buffer = fs.readFileSync(pdf)

  await expect(expect(buffer).toMatchPDFSnapshot()).rejects.toThrowError(
    'options.name must be provided for Buffer inputs'
  )
})

it('sanitizes and lowercases auto-generated names from path input', () => {
  const state = {
    currentTestName: 'Group / A Test:Case'
  } as any

  const name = getSnapshotName(state, 'C:/tmp/Sample.File.pdf', {})
  expect(name).toBe('group - a test-case - sample.file')
})

it('throws for unsupported input types', () => {
  const state = {
    currentTestName: 'unsupported'
  } as any

  expect(() => getSnapshotName(state, 123 as any, {})).toThrow(
    'Unsupported input was provided'
  )
})
