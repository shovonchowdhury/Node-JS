import net from 'node:net';

const server= net.createServer();


server.listen(4000,'0.0.0.0',()=>{
    console.log('Listening on port 4000');
});

server.on('connection',(socket)=>{
    socket.on('data',(chunk)=>{

        console.log(chunk.toString());
        socket.write('HTTP\n\nGot the message');
        socket.end();
    })

    // console.log(socket.address());
    socket.on('error',()=>{
        console.log(`${socket.remoteAddress} Client lost`);
    })
    socket.on('close',()=>{
        console.log(`Disconnected : ${socket.remoteAddress}`);
    })
    console.log(`Connection established : ${socket.remoteAddress}`);
})