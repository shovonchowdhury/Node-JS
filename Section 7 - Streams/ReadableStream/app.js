import { time } from 'console';
import fs from 'fs';

console.time();

const readStream= fs.createReadStream("D:\\movei\\1915.Legend.of.the.Gurkhas.2023.1080p.AMZN.WEB-DL.DDP5.1.HEVC ESUB ~JOY~.mkv",{highWaterMark: 100*1024*1024 });

let count=0;



readStream.on('data',(chunkBuffer)=>{
    count++;
    fs.appendFileSync('stream.mp4',chunkBuffer);

})

readStream.on('end',()=>{
    console.timeEnd();
    console.log(count);
})