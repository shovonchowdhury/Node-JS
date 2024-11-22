import fs from 'node:fs/promises';

const bufferContent=await fs.readFile("picture.txt");

const data=bufferContent.toString();

fs.writeFile('picture.jpeg',data,'base64');