import fs from 'fs';


console.time();

const readStream= fs.createReadStream('yo.txt',{highWaterMark: 4 });

const writeStresm= fs.createWriteStream('file.txt',{highWaterMark: 4 })

readStream.on('data',(chunkBuffer)=>{
    const isEmpty=writeStresm.write(chunkBuffer);

    
    if(!isEmpty)
    {
        readStream.pause();
    }

})

writeStresm.on('finish',()=>{
    console.log('finished');
})

writeStresm.on('drain',()=>{

    readStream.resume();
})

readStream.on('end',()=>{
    console.timeEnd();
    
})