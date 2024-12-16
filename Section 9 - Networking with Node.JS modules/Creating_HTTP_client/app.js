import http from 'node:http';

const server= http.createServer((request,response)=>{

    console.log(request.url);
    console.log(request.headers);
    console.log(request.method);

    response.setHeader("Content-Length","18");
    response.end('Hello from server.');
    console.log('Requesting...');

    request.on('data',(chunk)=>{
        
        console.log(chunk.toString());
    })
});

server.listen(80,'0.0.0.0',()=>{
    console.log('Server started...');
})