import path from 'node:path'

// Register PDF snapshot service
import '../src/index'

it('should match pdf', async () => {
  const pdf = path.resolve(__dirname, 'assets/sample.pdf')

  return expect(pdf).toMatchPDFSnapshot()
})
