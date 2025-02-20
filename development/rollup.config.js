import commonjs from '@rollup/plugin-commonjs'
import nodeResolve from '@rollup/plugin-node-resolve'
export default {
  input: './index.js',
  output: [
    {
      file: '../distributement/core-plex.js',
      format: 'es',
      sourcemap: true,
    },
    {
      file: '../demonstrament/static/dependencies/core-plex.js',
      format: 'es',
      sourcemap: true,
    }
  ],
  plugins: [
    commonjs({ transformMixedEsModules: true }),
    nodeResolve(),
  ]
}