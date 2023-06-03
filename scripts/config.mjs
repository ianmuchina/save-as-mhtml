export const config = {
    entryPoints: [
      'src/options.ts',
      'src/background.ts'
    ],
    bundle: true,
    format: 'esm',
    minify: false,
    sourcemap: true,
    target: 'esnext',
    outdir: 'dist'
  }