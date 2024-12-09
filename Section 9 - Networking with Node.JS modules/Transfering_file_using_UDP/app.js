import dgram from 'node:dgram';
import { createWriteStream } from 'node:fs';

const socket= dgram.createSocket('udp4');

const writeStream=createWriteStream('numbers.txt');

socket.on('message',(message,remoteAddress)=>{

    // console.log(remoteAddress.address,remoteAddress.port);
    // console.log(message.toString());
    

    if(message.toString()=='EOF')
    {
        socket.send('response back from app.js',remoteAddress.port,remoteAddress.address);
    }
    else
        writeStream.write(message);

    

})


// socket.send('hi from laptop pro',3000,'192.168.0.5');

socket.bind(4000, ()=>{
    console.log(socket.address());
    console.log(`Listening on port ${socket.address().port}`);
});