import dgram from 'node:dgram';

const socket= dgram.createSocket('udp4');

socket.on('message',(message,remoteAddress)=>{

    console.log(remoteAddress.address,remoteAddress.port);
    console.log(message.toString());

    socket.send('response back from app.js',remoteAddress.port,remoteAddress.address);

})


// socket.send('hi from laptop pro',3000,'192.168.0.5');

socket.bind(4000, ()=>{
    console.log(socket.address());
    console.log(`Listening on port ${socket.address().port}`);
});