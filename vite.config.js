import { resolve, join } from 'path';
import { writeFileSync } from 'fs';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    process.env.WITH_FIX && {
      name: 'add-common-js-package-plugin',
      writeBundle(options) {
        if (options.format === 'cjs') {
          writeFileSync(join(options.dir, 'package.json'), JSON.stringify({ type: 'commonjs' }));
        }
      },
    },
  ],
});
