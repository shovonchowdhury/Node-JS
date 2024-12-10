import net from 'node:net';


const socket= net.createConnection({port:4000,host:'192.168.0.4'});

socket.on('error',()=>{
    console.log('Server lost.')
})

setTimeout(()=>{
    socket.write('HI');
    socket.end();
},2000)

socket.on('data',(chunk)=>{
    console.log(chunk.toString());
})