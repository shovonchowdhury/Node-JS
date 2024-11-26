import { createReadStream } from "fs";

const readStream= createReadStream("D:\\movei\\1915.Legend.of.the.Gurkhas.2023.1080p.AMZN.WEB-DL.DDP5.1.HEVC ESUB ~JOY~.mkv",{highWaterMark: 100*1024*1024 });

readStream.pipe(process.stdout);