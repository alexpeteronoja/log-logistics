import fs from 'fs';
import path from 'path';
import { globSync } from 'glob';
import * as babel from '@babel/core';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const srcDir = path.join(__dirname, 'src');
const files = globSync('**/*.{ts,tsx}', { cwd: srcDir, absolute: true });

files.forEach(file => {
  const ext = path.extname(file);
  const isTSX = ext === '.tsx';
  const newExt = isTSX ? '.jsx' : '.js';
  const newFile = file.slice(0, -ext.length) + newExt;

  console.log(`Converting ${file} -> ${newFile}`);

  try {
    const result = babel.transformFileSync(file, {
      presets: [
        ['@babel/preset-typescript', { isTSX: true, allExtensions: true }]
      ],
      retainLines: true,
      configFile: false,
      babelrc: false
    });

    let code = result.code;
    
    // Quick regex to fix explicit .tsx/.ts imports if they exist
    code = code.replace(/\.tsx/g, '.jsx').replace(/\.ts/g, '.js');
    
    fs.writeFileSync(newFile, code);
    fs.unlinkSync(file);
  } catch (err) {
    console.error(`Failed on ${file}:`, err.message);
  }
});
