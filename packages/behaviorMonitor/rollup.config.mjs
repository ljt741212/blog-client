import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';

/**
 * Rollup config for the behaviorMonitor SDK.
 *
 * - Input:  index.ts (TypeScript source)
 * - Output: dist/index.esm.js (ESM)
 *           dist/index.cjs.js (CommonJS)
 *           dist/index.umd.js (UMD, global name: BehaviorMonitor)
 */
const isProd = process.env.NODE_ENV === 'production';

export default {
  input: 'index.ts',
  output: [
    {
      file: 'dist/index.esm.js',
      format: 'esm',
      sourcemap: !isProd
    },
    {
      file: 'dist/index.cjs.js',
      format: 'cjs',
      sourcemap: !isProd
    },
    {
      file: 'dist/index.umd.js',
      format: 'umd',
      name: 'BehaviorMonitor',
      sourcemap: !isProd
    }
  ],
  plugins: [
    resolve(),
    commonjs(),
    typescript({
      tsconfig: './tsconfig.json'
    })
  ]
};

