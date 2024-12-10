import net from 'node:net';


const socket= net.createConnection({port:4000,host:'192.168.0.4'});

socket.on('error',()=>{
    console.log('Server lost.')
})

process.stdin.on('data',(input)=>{
    socket.write(input);
})
// setTimeout(()=>{
//     
//     socket.end();
// },2000)

socket.on('data',(chunk)=>{
    console.log(chunk.toString());
})