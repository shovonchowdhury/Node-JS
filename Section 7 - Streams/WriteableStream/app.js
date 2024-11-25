import fs from 'fs';


console.time();

const readStream= fs.createReadStream("D:\\movei\\1915.Legend.of.the.Gurkhas.2023.1080p.AMZN.WEB-DL.DDP5.1.HEVC ESUB ~JOY~.mkv",{highWaterMark: 100*1024*1024 });

const writeStresm= fs.createWriteStream('stream.mp4',{highWaterMark: 100*1024*1024 })




readStream.on('data',(chunkBuffer)=>{
    writeStresm.write(chunkBuffer);

})

readStream.on('end',()=>{
    console.timeEnd();
    
})


