import { cpSync, copyFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const publicDir = path.join(root, 'public');
const staticDir = path.join(root, '.next', 'static');
const standaloneDir = path.join(root, '.next', 'standalone');
const envFiles = ['.env.production'];

function findStandaloneServers(dir, results = []) {
  if (!existsSync(dir)) {
    return results;
  }

  for (const entry of readdirSync(dir)) {
    if (entry === 'node_modules') {
      continue;
    }

    const fullPath = path.join(dir, entry);
    const stats = statSync(fullPath);

    if (stats.isDirectory()) {
      findStandaloneServers(fullPath, results);
      continue;
    }

    if (entry === 'server.js') {
      results.push(fullPath);
    }
  }

  return results;
}

if (!existsSync(publicDir) || !existsSync(standaloneDir)) {
  process.exit(0);
}

for (const serverFile of findStandaloneServers(standaloneDir)) {
  const appDir = path.dirname(serverFile);

  const targetPublicDir = path.join(appDir, 'public');
  cpSync(publicDir, targetPublicDir, { recursive: true, force: true });
  console.log(`Copied public assets to ${path.relative(root, targetPublicDir)}`);

  if (existsSync(staticDir)) {
    const targetStaticDir = path.join(appDir, '.next', 'static');
    cpSync(staticDir, targetStaticDir, { recursive: true, force: true });
    console.log(`Copied Next static assets to ${path.relative(root, targetStaticDir)}`);
  }

  for (const envFile of envFiles) {
    const sourceEnv = path.join(root, envFile);
    if (existsSync(sourceEnv)) {
      copyFileSync(sourceEnv, path.join(appDir, envFile));
      console.log(`Copied ${envFile} to ${path.relative(root, appDir)}`);
    }
  }
}
