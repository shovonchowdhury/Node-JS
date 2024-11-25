import fs from 'fs';

const writeStream=fs.createWriteStream('file.txt',{highWaterMark:4});

let i=1;

function writeA1000(){
    while(i<=20)
        {
            console.log(writeStream.writableLength);
            const isEmpty=writeStream.write('a');
            console.log(isEmpty);
            i++;
            if(!isEmpty)
            {
               break;
            }
        }
}

writeA1000();
writeStream.on('drain',()=>{
    writeA1000();
})