import { createReadStream } from 'node:fs';
import { open } from 'node:fs/promises';
import net from 'node:net';

const socket= net.createServer(async (socket)=>{

    // const fileHandle = await open("H:\\movei\\bareilly ki barfi 2017 720p.HEVC.bluRay.x265.mkv")
    const fileHandle = await open("Mita Talukder.pdf");
    const {size}=await fileHandle.stat()
    const readStream = fileHandle.createReadStream();
    socket.write("HTTP/1.1 200 yahoo\n");
    
    // socket.write('Content-Type: application/pdf\n');
    // socket.write('Content-Type: video/mp4\n');
    socket.write('Content-Disposition: attachment; filename = motu.pdf\n');
    socket.write(`Content-Length: ${size}`);
    

    socket.write("\n\n");
   
     readStream.pipe(socket);
    // socket.write('abcdef');
    socket.on('data',(chunk)=>{
        console.log(chunk.toString());
    })

    socket.on('end',()=>{
        console.log('Data fully loaded');
    })

    socket.on('error',()=>{
        console.log(`${socket.remoteAddress}: client lost.`);
    })

    socket.on('close',()=>{
        console.log(`${socket.remoteAddress}: client disconnected.`);
    })


}
)


socket.listen(4000,'0.0.0.0',()=>{
    console.log('server running on port 4000');
})