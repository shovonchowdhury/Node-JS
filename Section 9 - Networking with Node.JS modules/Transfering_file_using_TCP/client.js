import { createReadStream } from 'node:fs';
import net from 'node:net';


const socket= net.createConnection({port:4000,host:'192.168.0.4'});

socket.on('error',()=>{
    console.log('Server lost.')
})

process.stdin.on('data',(input)=>{
    const inputString=input.toString().trim();
    
    if (inputString === 'send') {
        // Predefined file path
        const filePath = "H:\\movei\\bareilly ki barfi 2017 720p.HEVC.bluRay.x265.mkv";
        const fileName = filePath.split('\\').pop(); // Extract file name from path

        socket.write(`FILE_START ${fileName}`);
        const readStream = createReadStream(filePath);

        readStream.on('error', (err) => {
            console.error(`Error reading file: ${err.message}`);
        });

        readStream.on('end', () => {
            socket.write('FILE_END');
        });

        readStream.pipe(socket); // Prevent socket from closing
    } else {
        socket.write(inputString);
    }
})

socket.on('data',(chunk)=>{
    console.log(chunk.toString());
})