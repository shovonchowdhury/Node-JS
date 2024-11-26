import fs from 'fs';

const fd= fs.openSync('file.txt');

const buffer= Buffer.alloc(4)

fs.read(fd,{
    buffer:buffer
},(err,byteRead,buff)=>{

    console.log(byteRead);
    console.log(buff.toString());
    console.log(buff);
})