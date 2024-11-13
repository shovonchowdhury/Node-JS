#!/usr/bin/env node
import fs from 'fs/promises'
const path1= process.argv[2];
const path2= process.argv[3];

console.log(path1,path2);

if(path1 && path2)
{
    const contentBuffer =await fs.readFile(`${path1}`);
    await fs.writeFile(`${path2}`, contentBuffer);
    console.log(`Content of path ${path1} has copied to path ${path2}`);
}
else
{
    console.error('There should be two valid file path.')
}

// C:\\Users\\L E N O V O\\Web Development\\Node.JS with Procodrr\\Section 3 - Fundamental of Node.JS\\fs_module\\file-1.txt

// C:\\Users\\L E N O V O\\Web Development\\Node.JS with Procodrr\\Section 3 - Fundamental of Node.JS\\shovon-file-copier\\file.txt