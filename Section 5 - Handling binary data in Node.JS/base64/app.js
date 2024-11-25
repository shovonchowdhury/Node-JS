import fs from 'node:fs/promises';

setTimeout(()=>{
    console.log('hi');
},0);

const bufferContent=await fs.readFile("picture.txt");
const data=bufferContent.toString();

fs.writeFile('picture.jpeg',data,'base64');