import axios from 'axios';
import { readdirSync, writeFileSync, readFileSync } from 'fs';
import path from 'path';
import FormData from 'form-data';
import fs from 'fs';
import * as dotenv from 'dotenv';
dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

const URL = process.env.VITE_WIDGET_SDK_BACKEND_URL + '/api/widget';
const widgetsPath = path.join(process.cwd(), 'src', 'scripts', 'dist');
const widgetList = path.join(widgetsPath, 'widgetList.txt');
const version = process.argv[2];

/**
 * Upload widgets
 *
 * @param {string} baseurl - server endpoint
 * @param {string} folderPath - folder for widgets dist
 * @param {string} version - component version
 * @returns {Promise} - server resp
 */
async function uploadWidget(baseurl, folderPath, version) {
  const form = new FormData();
  const configStr = fs.readFileSync(`${folderPath}/config.json`, { encoding: 'utf8' });
  form.append('config', configStr);
  form.append('version', version);
  form.append('js', fs.createReadStream(`${folderPath}/index.js`));
  form.append('css', fs.createReadStream(`${folderPath}/index.css`));
  return axios.post(`${baseurl}/component`, form, {
    headers: {
      ...form.getHeaders(),
      'x-api-key': process.env.UPLOAD_WIDGET_API_KEY,
    },
  });
}
if (process.argv.length !== 3) {
  console.error('Usage: npm run publish-widgets $VERSION', '\nYou must provide a string version for these widgets');
  process.exit(1);
}
const dirs = readdirSync(widgetsPath, {
  withFileTypes: true,
}).filter((dirent) => dirent.isDirectory());

async function release(targets) {
  return axios.post(
    `${URL}/env`,
    {
      env: 'xhis',
      widgets: targets.split(',').map((w) => ({
        name: w,
      })),
      version,
    },
    {
      headers: {
        'x-api-key': process.env.UPLOAD_WIDGET_API_KEY,
      },
    }
  );
}

async function exec() {
  for (const dir of dirs) {
    if (dir.isDirectory()) {
      const dirPath = path.join(widgetsPath, dir.name);
      console.log(dirPath);
      await uploadWidget(URL, dirPath, version);
    }
  }
  writeFileSync(widgetList, dirs.map((dir) => dir.name).join(','));

  let targets = readFileSync(widgetList, 'utf8');
  targets = targets.trim().replaceAll('_', '-');
  await release(targets);
  console.log('published');
}

exec();
