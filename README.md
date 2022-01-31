# VitePress × ESM Package bug

When setting `"type": "module"` in the root package.json of your VitePress project, the build step will fail as the bundle placed in the `.vitepress/.temp` folder consists of CJS files.

The bug can be reproduced with the `npm run build` command.

```bash
vitepress build .

vitepress v0.21.6
✓ building client + server bundles...
✖ rendering pages...
build error:
 Error [ERR_REQUIRE_ESM]: Must use import to load ES Module: /home/test-vitepress-module/.vitepress/.temp/app.js
require() of ES modules is not supported.
require() of /home/test-vitepress-module/.vitepress/.temp/app.js from /home/test-vitepress-module/node_modules/vitepress/dist/node/serve-9874c5ac.js is an ES module file as it is a .js file whose nearest parent package.json contains "type": "module" which defines all .js files in that package scope as ES modules.
Instead rename app.js to end in .cjs, change the requiring code to use import(), or remove "type": "module" from /home/test-vitepress-module/package.json.

    at new NodeError (internal/errors.js:322:7)
    at Object.Module._extensions..js (internal/modules/cjs/loader.js:1102:13)
    at Module.load (internal/modules/cjs/loader.js:950:32)
    at Function.Module._load (internal/modules/cjs/loader.js:790:12)
    at Module.require (internal/modules/cjs/loader.js:974:19)
    at require (internal/modules/cjs/helpers.js:93:18)
    at renderPage (/home/test-vitepress-module/node_modules/vitepress/dist/node/serve-9874c5ac.js:40213:25)
    at Object.build (/home/test-vitepress-module/node_modules/vitepress/dist/node/serve-9874c5ac.js:40362:15) {
  code: 'ERR_REQUIRE_ESM'
}
```

This bug can be fixed by appending a `package.json` file with the `type` key set to `commonjs` to the `.vitepress/.temp/` directory on build to make sure that the `.js` files in this directory. This can be done with a Vite plugin:

```js
import { resolve, join } from 'path';
import { writeFileSync } from 'fs';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    {
      name: 'add-common-js-package-plugin',
      writeBundle(options) {
        if (options.format === 'cjs') {
          writeFileSync(
          	join(options.dir, 'package.json'),
          	JSON.stringify({ type: 'commonjs' })
          );
        }
      },
    },
  ],
});
```

The fix can be tested with the `npm run build:fixed` command.
