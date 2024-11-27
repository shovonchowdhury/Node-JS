import fs from 'fs';

const fd= fs.openSync('numbers.txt','w');

//normally fs.read() uses buffer but fs.write() doesn't.

console.time();
for(let i=1;i<=100000;i++){
    fs.writeSync(fd,`${i} `);
}

fs.closeSync(fd);

console.timeEnd();

