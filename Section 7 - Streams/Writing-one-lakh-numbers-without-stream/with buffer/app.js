import fs from 'fs';

console.time();

const fd=fs.openSync('number.txt','w');
const buff=Buffer.allocUnsafe(16*1024);

let totalWrittenByteLength=0;
let remainingStr="";
for(let i=1;i<=100000;i++)
{
    let str=`${i}, `;
    str= remainingStr+str;

    const writtenByteLength=buff.write(str,totalWrittenByteLength);

    remainingStr="";
    totalWrittenByteLength+=writtenByteLength;

    if(writtenByteLength<str.length)
    {
        remainingStr=str.slice(writtenByteLength);
    }

    if(totalWrittenByteLength==buff.byteLength)
    {
        fs.writeSync(fd,buff);
        totalWrittenByteLength=0;

    }

}



    fs.writeSync(fd,buff.subarray(0,totalWrittenByteLength));
    fs.writeSync(fd,remainingStr);

console.timeEnd();

