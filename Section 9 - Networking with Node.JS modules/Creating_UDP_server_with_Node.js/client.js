import dgram from 'node:dgram';

const socket= dgram.createSocket('udp4');

socket.on('message',(message,remoteAddress)=>{
    console.log(message.toString());
    socket.close();

})


socket.send('hi from client',4000,'192.168.0.4',()=>{
    console.log('Message sent');
    
});








