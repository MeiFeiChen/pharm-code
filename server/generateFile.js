import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dirCodesPath = path.join(__dirname, "codes");

if (!fs.existsSync(dirCodesPath)) {
  fs.mkdirSync(dirCodesPath, { recursive: true });
}

const generateFile = (format, content) => {
  try {
    const jobId = uuidv4();
    const filename = `${jobId}.${format}`;
    const filepath = path.join(dirCodesPath, filename);
    fs.writeFileSync(filepath, content);

    return filename;
  } catch (error) {
    console.error('Error generating file:', error.message);
    throw error; // Re-throw the error to propagate it to the caller
  }
};

export default generateFile;

