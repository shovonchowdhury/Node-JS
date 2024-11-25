import fs from 'fs';


console.time();
const readStream= fs.createReadStream("D:\\movei\\1915.Legend.of.the.Gurkhas.2023.1080p.AMZN.WEB-DL.DDP5.1.HEVC ESUB ~JOY~.mkv",{highWaterMark: 1*1024*1024 });

const writeStresm= fs.createWriteStream('stream.mp4',{highWaterMark: 1*1024*1024 });


readStream.pipe(writeStresm);

readStream.on('error',(err)=>{
    console.log(err);
})

setTimeout(() => {
    readStream.unpipe(writeStresm);
    readStream.destroy('khatam');
}, 3000);

readStream.on('end',()=>{
    console.timeEnd();
})