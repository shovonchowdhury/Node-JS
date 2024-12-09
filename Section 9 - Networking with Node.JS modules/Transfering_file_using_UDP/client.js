import dgram from 'node:dgram';
import { createReadStream, statSync } from 'node:fs';
// import { createReadStream } from 'node:fs';

const socket= dgram.createSocket('udp4');

const totalSize=statSync("C:\\Users\\L E N O V O\\Downloads\\numbers_1_to_100000.txt");

console.log(totalSize.size);

const readStream= createReadStream("C:\\Users\\L E N O V O\\Downloads\\numbers_1_to_100000.txt",{highWaterMark:1000});


socket.on('message',(message,remoteAddress)=>{
    console.log(message.toString());
    socket.close();

})

readStream.on('data',(chunk)=>{

    socket.send(chunk,4000,'192.168.0.4',()=>{

        const readPercentage=((readStream.bytesRead/totalSize.size)*100).toFixed(2);
        console.log(`${readPercentage}% data has been read`);
        
    });
})

readStream.on('end',()=>{
    socket.send('EOF',4000,'192.168.0.4',()=>{
        console.log('Message sent');
        
    });
})
