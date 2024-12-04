import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const cacheDir = path.resolve(__dirname, 'node_modules/.cache');

fs.rm(cacheDir, { recursive: true, force: true }, (err) => {
  if (err) {
    console.error(`Error deleting cache directory: ${err.message}`);
  } else {
    console.log('Cache directory deleted successfully.');
  }
});