/* eslint-disable @typescript-eslint/no-empty-function */
import { build } from 'vite';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import requireFromString from 'require-from-string';
import betterAjvErrors from 'better-ajv-errors';
import PQueue from 'p-queue';
import v8 from 'v8';
import vm from 'vm';
import ts from 'typescript';

import { validate, configSchema } from './validateConfig.mjs';
import buildConfig from './build.config.mjs';

import * as dotenv from 'dotenv';
dotenv.config({ path: `.env.local` });
/**
 * Only build specific widgets (for faster hot reload build)
 * You can set as environment variable with comma separted string (ex. export FOCUS_WIDGETS=DrugOrder,IcdEditor)
 * Or directly set in default array locally (ex. ['DrugOrder', 'IcdEditor'])
 *
 * NOTE: Do not push to master if you set focus widgets in default array
 */
const FOCUS_WIDGETS = process.env.FOCUS_WIDGETS ? process.env.FOCUS_WIDGETS.split(',') : []; // default array

/** Turn off gc for faster build (now mainly for dev build) */
const TUNR_OFF_GC = process.env.GC === 'false';
const IS_DEV = process.env.NODE_ENV === 'dev';

/** Only allow partial build for dev build */
const IS_PARTIAL_BUILD = IS_DEV && FOCUS_WIDGETS.length;

v8.setFlagsFromString('--expose_gc');
const gc = TUNR_OFF_GC ? () => { } : vm.runInNewContext('gc');
const queue = new PQueue({ concurrency: 3 });

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const { readdir, rm } = fs.promises;

const widgetFolder = `src/tutorials/tutorial_${process.env.VITE_TUTORIAL_INDEX}/widgets`;
const IN_DIR = resolve(__dirname, '../..', widgetFolder);
const OUT_DIR = resolve(__dirname, 'dist');
const MAP_DIR = resolve(__dirname, 'mapping');

function removeOutDir() {
  console.log('Removing dist...');
  return rm(OUT_DIR, { recursive: true, force: true });
}

function removeMapDir() {
  console.log('Removing mapping...');
  return rm(MAP_DIR, { recursive: true, force: true });
}

function tsCompile(source, options) {
  // Default options -- you could also perform a merge, or use the project tsconfig.json
  if (!options) {
    options = { compilerOptions: { module: ts.ModuleKind.CommonJS } };
  }
  return ts.transpileModule(source, options).outputText;
}

function ensurePath(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, {
      recursive: true,
    });
  }
}

function renameFile(moduleDir, config, version) {
  const newName = `js-${config.name}-${version}.js.map`;
  fs.renameSync(resolve(OUT_DIR, moduleDir, './index.js.map'), resolve(MAP_DIR, `./${newName}`));
  return newName;
}

async function buildWidgets(dir, version) {
  const outDir = OUT_DIR;
  const dirents = await readdir(dir, { withFileTypes: true });
  const indexes = [];

  ensurePath(MAP_DIR);

  dirents.forEach((dirent) => {
    const res = resolve(dir, dirent.name);
    if (dirent.isDirectory() && fs.existsSync(resolve(res, 'index.ts'))) {
      indexes.push(res);
    }
  });

  const promises = indexes.map((index) => async () => {
    if (
      // Only allow partial build for dev build
      IS_PARTIAL_BUILD &&
      !FOCUS_WIDGETS.some((widget) => index.includes(widget))
    ) {
      return;
    }
    const configStrTs = fs.readFileSync(resolve(index, 'config.ts'), 'utf-8');
    const configStrJs = tsCompile(configStrTs);
    const config = requireFromString(configStrJs).default;

    const valid = validate(config);
    if (!valid) {
      console.log('err', validate.errors);
      console.log(betterAjvErrors(configSchema, config, validate.errors));
      throw new Error(`Invalid config ${JSON.stringify(config)}`);
    }

    // '-' is not valid in external name
    const moduleDir = config.name.replace(/-/g, '_');

    await build(
      buildConfig({
        path: index,
        extName: moduleDir,
        outDir,
      })
    );

    fs.writeFileSync(resolve(outDir, moduleDir, 'config.json'), JSON.stringify(config, null, 2));

    renameFile(moduleDir, config, version);
    gc();
  });
  return queue.addAll(promises);
}

const main = async (version) => {
  // Do not remove dist dir for partial build to work
  if (!IS_PARTIAL_BUILD) {
    await removeOutDir();
    await removeMapDir();
  }
  await buildWidgets(IN_DIR, version);
  console.log('widet folder:', IN_DIR);
  console.log('build finished');
};

main(process.argv[2] || 0);
