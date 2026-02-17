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
export default {
  input: 'index.ts',
  output: [
    {
      file: 'dist/index.esm.js',
      format: 'esm',
      sourcemap: true
    },
    {
      file: 'dist/index.cjs.js',
      format: 'cjs',
      sourcemap: true
    },
    {
      file: 'dist/index.umd.js',
      format: 'umd',
      name: 'BehaviorMonitor',
      sourcemap: true
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

