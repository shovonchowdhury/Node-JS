import fs from 'node:fs/promises';
import { Buffer } from 'node:buffer';
const str="hello world";

const nodeBuffer=Buffer.from('hello world');

fs.writeFile('./file.txt',nodeBuffer);