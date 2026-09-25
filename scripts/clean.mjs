import { rmSync } from 'node:fs';

for (const path of ['dist', 'server.js']) {
  rmSync(path, { force: true, recursive: true });
}