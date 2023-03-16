/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const fs = require('fs');
const fsPromises = require('fs').promises;
const copyFilesTree = require('copy-files-tree');

async function copyFiles(srcFile, destFile) {
  if (fs.existsSync(destFile)) {
    return;
  }
  return fsPromises.copyFile(srcFile, destFile);
}

copyFilesTree(
  { fullyChosen: true },
  path.resolve('node_modules', '@asus-aics', 'xui', 'dist', 'assets'),
  path.resolve('public', 'assets')
);

copyFilesTree(
  { files: [{ name: 'index.css' }] },
  path.resolve('node_modules', '@asus-aics', 'xui', 'dist'),
  path.resolve('public')
);

copyFiles('./assets/.env', './.env.local');
