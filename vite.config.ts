import { defineConfig } from 'vite-plus'

export default defineConfig({
  staged: {
    '*': 'vp check --fix'
  },
  pack: {
    copy: ['./src/types.d.ts'],

    dts: {
      tsgo: true
    }
  },
  lint: {
    options: {
      typeAware: true,
      typeCheck: true
    }
  },
  fmt: {},

  test: {
    globals: true
  }
})
