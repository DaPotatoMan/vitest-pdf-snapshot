import fs from 'node:fs'
import path from 'node:path'

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
