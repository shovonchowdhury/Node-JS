import { spawn } from "child_process";
import { createWriteStream } from "fs";

const childProcess= spawn("node",["child_app.js"]);

// childProcess.stdout.on('data',(chunk)=>{
//     console.log(chunk.toString());
// })

const writeStresm= createWriteStream('stream.mp4',{highWaterMark: 100*1024*1024 });

childProcess.stdout.pipe(writeStresm);