import { createReadStream } from 'node:fs';
import net from 'node:net';

const socket= net.createServer((socket)=>{

    socket.write("HTTP/1.1\n\n");
    const readStream= createReadStream("H:\\Synnaps class video\\2nd lecture.mp4");
    readStream.pipe(socket);
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