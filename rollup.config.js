import svelte from 'rollup-plugin-svelte';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import css from 'rollup-plugin-css-only';

const production = !process.env.ROLLUP_WATCH;

export default {
  input: 'src/main.js',
  output: {
    sourcemap: !production,
    format: 'iife',
    name: 'app',
    file: 'public/build/bundle.js'
  },
  plugins: [
    svelte({
      compilerOptions: {
        // Enable run-time checks when not in production
        dev: !production,
        // We'll use custom element mode for Google Sites embedding
        customElement: true
      }
    }),
    // Extract CSS into a separate file
    css({ output: 'bundle.css' }),

    // Resolve node_modules
    resolve({
      browser: true,
      dedupe: ['svelte']
    }),
    
    // Convert CommonJS modules to ES6
    commonjs(),

    // Minify in production
    production && terser()
  ],
  watch: {
    clearScreen: false
  }
};
